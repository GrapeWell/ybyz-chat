import io, { Socket } from 'socket.io-client';
import { createRtcPeerConnection } from './webrtc';
import { mapGet, rtcPeerConnectionMap } from '@/common/maps';

// 初始化时，只有一个人在，则只创建stream
const onConnect = (socket: Socket, room: string, nickname: string) => async (sid: string) => {

  // 已存在连接则忽略
  if (rtcPeerConnectionMap.get(sid)) {
    console.warn("Received connect from known peer");
    return;
  }

  // 创建本地连接，sid为自己的id
  const peerConnection = createRtcPeerConnection(socket, room, nickname, sid);
  rtcPeerConnectionMap.set(sid, peerConnection);
  const offerSdp = await peerConnection.createOffer();
  peerConnection.setLocalDescription(offerSdp);

  socket.emit('offer', offerSdp, room)

}

// 接收到其他人的offer和sid，并存进map
const onOffer = (socket: Socket, room: string, nickname: string) => async ({ offer, sid }) => {
  // 创建连接，sid为对方的id
  const peerConnection = createRtcPeerConnection(socket, room, nickname, sid);
  rtcPeerConnectionMap.set(sid, peerConnection);
  peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answerSdp = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answerSdp);

  // 通知对方自己的sdp
  socket.emit("answer", answerSdp, room, sid);
}

// 接收到对方的answer，本地连接设置对方的sdp
const onAnswer = () => ({ answer, sid }) => {
  console.log("answer", answer)
  const rtcPeerConnection = mapGet(rtcPeerConnectionMap, sid);
  rtcPeerConnection.setRemoteDescription(
    new RTCSessionDescription(answer)
  );
}

const onCandidate = () => ({ sid, candidate, label, users }) => {
  const peerConnection = mapGet(
    rtcPeerConnectionMap,
    sid
  );
  peerConnection.addIceCandidate(
    new RTCIceCandidate({
      sdpMLineIndex: label,
      candidate: candidate,
    })
  )
}

const onUserIn = (updateUsers) => ({ users, sid }) => {
  updateUsers([...users])
}

export const createSocket = (room: string, nickname: string, updateUsers: (users: string[]) => void) => {
  const socket = io('http://162.14.123.224:3000')

  // 加入房间，开始流程
  socket.emit('join_room', { room, nickname })

  socket.on('connected', onConnect(socket, room, nickname))
  socket.on('offer', onOffer(socket, room, nickname))
  socket.on('answer', onAnswer())
  socket.on('ice-candidate', onCandidate())
  socket.on('user_join', onUserIn(updateUsers))
}