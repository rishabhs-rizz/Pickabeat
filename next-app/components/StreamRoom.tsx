export function StreamRoom({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const accessToken = localStorage.getItem("accessToken");
  return (
    <>
      <div className="bg-black h-screen text-white">
        aa liye re token ke sath {accessToken}{" "}
      </div>
    </>
  );
}
