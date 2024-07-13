import { saveRoomInfoToLocalStorage } from "@/common/utils";
import { message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useHome = () => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [nickname, setNickname] = useState("");
  const handleClick = () => {
    if (!roomName) {
      message.error("Please enter a room name");
      return;
    }
    if (!nickname) {
      message.error("Please enter a nickname");
      return;
    }
    saveRoomInfoToLocalStorage(roomName, nickname);
    navigate(`/room?id=${roomName}`);
  };
  return { handleClick, setRoomName, setNickname, roomName, nickname };
};

export default useHome;
