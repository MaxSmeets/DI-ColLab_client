import React, { useState } from "react";
import { MdMicNone, MdMicOff, MdVideocam, MdVideocamOff } from "react-icons/md";
import Chatlog from "./Chatlog";
import WebcamSm from "./WebcamSm";

function Chatroom() {
  const [mic, setMic] = useState(false);
  const [cam, setCam] = useState(false);

  return (
    <div className='absolute w-full bottom-5'>
      <h1>Chatroom</h1>
      <Chatlog />
      <textarea
        type='text'
        placeholder=''
        className='w-full px-1 my-1 mr-2 bg-gray-100 focus:bg-gray-200'
      />
      <div className='flex my-1'>
        <button
          className={
            mic
              ? "flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 h-full"
              : "flex items-center justify-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2 h-full"
          }
          onClick={() => setMic(!mic)}
        >
          {mic ? (
            <MdMicNone className='size-4' />
          ) : (
            <MdMicOff className='size-4' />
          )}
        </button>
        <button
          className={
            cam
              ? "flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 h-full"
              : "flex items-center justify-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2 h-full"
          }
          onClick={() => setCam(!cam)}
        >
          {cam ? (
            <MdVideocam className='size-4' />
          ) : (
            <MdVideocamOff className='size-4' />
          )}
        </button>
        {cam ? <WebcamSm audio={mic} /> : null}
      </div>
    </div>
  );
}

export default Chatroom;
