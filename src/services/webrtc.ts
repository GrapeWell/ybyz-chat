import { mapGet, streamMap } from "@/common/maps";
import { Socket } from "socket.io-client";

const iceServers = {
  iceServers: [
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

export const createRtcPeerConnection = (socket: Socket, roomName: string, nickname: string, sid: string) => {
  const peerConnection = new RTCPeerConnection(iceServers);
  const stream = mapGet(streamMap, 'local');

  // 获取本地stream，加入轨道
  stream?.getTracks().forEach((track) => {
    peerConnection.addTrack(track, stream);
  });

  peerConnection.ontrack = (e) => {
    console.debug("ontrack", e.streams);
    if (e.streams.length > 0) {
      streamMap.set(sid, e.streams[0]);
    }
  };

  peerConnection.onicecandidate = (e) => {
    console.debug(
      "ice candidate",
      e.candidate?.candidate,
      peerConnection.iceConnectionState
    );
    if (e.candidate !== null) {
      // 触发 webRtcIceCandidate 事件传递 candidate
      socket.emit("ice-candidate", {
        room: roomName,
        sid,
        label: e.candidate.sdpMLineIndex,
        candidate: e.candidate.candidate,
      });
    }
  };

  return peerConnection;
}