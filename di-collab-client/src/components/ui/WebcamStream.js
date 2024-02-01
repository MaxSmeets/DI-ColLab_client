import React from "react";
import { useRoom } from "../../providers/RoomProvider";
import { useUser } from "../../providers/UserProvider";
import { FiUser } from "react-icons/fi";
import AudioMeter from "./AudioMeter";

function WebcamStream({ videoRef }) {
  const { username } = useUser();
  const { cam, mic } = useRoom();

  return (
    <div className='w-screen mx-auto text-white bg-primary'>
      {cam ? (
        <div className='relative w-48 h-24 m-2 overflow-hidden rounded-md bg-slate-700'>
          <video
            className='absolute top-0 left-0 w-full h-full'
            ref={videoRef}
            autoPlay
          />
          {mic && (
            <div className='absolute bottom-0 left-0 w-full'>
              <AudioMeter />
            </div>
          )}
        </div>
      ) : (
        <div className='relative w-48 h-24 m-2 overflow-hidden rounded-md bg-slate-700'>
          <div className='absolute top-0 left-0 w-full h-full'>
            {mic && <AudioMeter />}
          </div>
          <div className='absolute inset-0 z-10 flex flex-col items-center justify-center'>
            <div>{username}</div>
            <FiUser size={50} />
          </div>
        </div>
      )}
    </div>
  );
}

export default WebcamStream;
