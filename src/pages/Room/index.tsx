import { rtcPeerConnectionMap, streamMap } from "@/common/maps";
import { useStore } from "@/model";
import { createSocket } from "@/services/socket";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const Room = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const users = useStore((state) => state.users);
  const [status, setStatus] = useState("initializing");
  const [roomName, setRoomName] = useState("");
  const [nickname, setNickname] = useState("");
  const roomId = searchParams.get("id") as string;
  const updateUsers = useStore((state) => state.updateUsers);
  useEffect(() => {
    if (roomId === undefined || roomId === "") {
      navigate("/");
    }
    setRoomName(roomId);

    const preRoomInfo: { roomName: string; nickname: string }[] = JSON.parse(
      localStorage.getItem("roomsInfo") || "[]"
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const preRoom = preRoomInfo.find((room: any) => room.roomName === roomName);
    if (preRoom !== undefined) {
      setNickname(preRoom.nickname);
    } else {
      setNickname("Guest" + Math.floor(Math.random() * 1000));
    }

    setStatus("requestingName");
  }, [navigate, nickname, roomId, roomName]);

  // 获取本地stream流
  useEffect(() => {
    if (status === "requestingName") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          streamMap.set("local", stream);
          setStatus("gettingPermissions");
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
    }
  }, [status]);

  useEffect(() => {
    if (status === "gettingPermissions") {
      createSocket(roomId, nickname, updateUsers);
    }
  }, [nickname, roomId, status, updateUsers]);

  // 清空
  useEffect(() => {
    return () => {
      setStatus("initializing");
      streamMap.forEach((stream, key) => {
        stream?.getTracks().forEach((track) => {
          track.stop();
        });
        streamMap.delete(key);
      });

      rtcPeerConnectionMap.forEach((rtcPeerConnection, sid) => {
        rtcPeerConnection.close();
        rtcPeerConnectionMap.delete(sid);
      });
    };
  }, []);

  return (
    <div>
      {users.map((participants: string) => {
        return <div>{participants}</div>;
      })}
    </div>
  );
};

export default Room;
