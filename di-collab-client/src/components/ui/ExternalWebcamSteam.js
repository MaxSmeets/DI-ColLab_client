import React from "react";
import { useRoom } from "../../providers/RoomProvider";
import { useUser } from "../../providers/UserProvider";
import { FiUser } from "react-icons/fi";

function WebcamStream({ externalUsername }) {
  return (
    <div className='w-screen bg-primary'>
      <div className='flex flex-col items-center justify-center w-48 h-24 m-2 text-white rounded-md bg-slate-700'>
        <div className='flex flex-col items-center justify-center'>
          {externalUsername}
          <FiUser size={50} />
        </div>
      </div>
    </div>
  );
}

export default WebcamStream;
