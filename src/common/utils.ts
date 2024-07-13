export const saveRoomInfoToLocalStorage = (roomName: string, nickName: string) => {
  let preRoomInfo: object[] = JSON.parse(localStorage.getItem('roomsInfo') || '[]');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preRoomInfo = preRoomInfo.filter((room: any) => room.roomName !== roomName);
  preRoomInfo.push({ roomName, nickname: nickName });
  localStorage.setItem('roomsInfo', JSON.stringify(preRoomInfo));
}