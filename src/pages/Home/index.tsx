import { Button, Input } from "antd";
import useHome from "./hooks";
import "./index.less";

const Home: React.FC = () => {
  const { handleClick, setRoomName, setNickname, roomName, nickname } =
    useHome();
  return (
    <div className="home">
      <div className="container">
        <div>这是属于我们的专属语音聊天室</div>
        <div className="input-box">
          <Input
            style={{ marginRight: "10px" }}
            placeholder="请输入房间号"
            onChange={(e) => setRoomName(e.target.value)}
            value={roomName}
          />
          <Input
            style={{ marginRight: "10px" }}
            placeholder="请输入昵称"
            onChange={(e) => setNickname(e.target.value)}
            value={nickname}
          />
          <Button onClick={handleClick}>创建</Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
