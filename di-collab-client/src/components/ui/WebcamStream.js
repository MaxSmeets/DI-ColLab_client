import React from "react";
import { useRoom } from "../../providers/RoomProvider";
import { useUser } from "../../providers/UserProvider";
import { FiUser } from "react-icons/fi";

function WebcamStream({ videoRef }) {
  const { username } = useUser();
  const { cam } = useRoom();
  return (
    <div className='w-screen bg-primary'>
      <div className='flex flex-col items-center justify-center w-48 h-24 m-2 text-white rounded-md bg-slate-700'>
        {cam ? (
          <video className='w-48 h-24 m-2' ref={videoRef} autoPlay />
        ) : (
          <div className='flex flex-col items-center justify-center'>
            {username}
            <FiUser size={50} />
          </div>
        )}
      </div>
    </div>
  );
}

export default WebcamStream;
