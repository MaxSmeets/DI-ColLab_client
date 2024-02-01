import React from "react";
import Login from "./ui/Login";
import Rooms from "./ui/Rooms";
import BottomBar from "./ui/BottomBar";
import UserInfo from "./ui/UserInfo";
import { useUser } from "../providers/UserProvider";
import { useRoom } from "../providers/RoomProvider";
import Chat from "./ui/Chat";
import Gather from "../assets/gather_screen.png";

function Stack() {
  const { userId } = useUser();
  const { roomId } = useRoom();

  return (
    <div
      className={
        userId
          ? "flex items-center w-screen h-screen bg-primary"
          : "flex items-center w-screen h-screen bg-primary justify-center"
      }
    >
      {userId ? (
        <div className='flex flex-col bg-primary'>
          <div className='flex flex-row w-full'>
            <div className='left-0 w-2/5 p-2 overflow-auto text-white custom-scrollbar'>
              <UserInfo />
              {roomId ? <Chat /> : null}
            </div>
            <div className='text-white'>
              <img
                src={Gather}
                alt='Gather'
                className='object-fill w-full h-full'
              />
            </div>
          </div>
          <BottomBar />
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default Stack;
