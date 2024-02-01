import React from "react";
import { FaPhone, FaPhoneSlash, FaMicrophone } from "react-icons/fa";
import { useClient } from "../../providers/ClientProvider";

function VideoMessage({ callStatus, sender, callId }) {
  const { client } = useClient();
  const onAnswer = async () => {
    try {
      const call = client.getCall(callId);
      if (call) {
        await call.answer();
        // Additional logic for when the call is answered
      }
    } catch (error) {
      console.error("Error answering call:", error);
    }
  };

  const onDecline = () => {
    const call = client.getCall(callId);
    if (call) {
      call.hangup(); // Decline is equivalent to hangup in Matrix
      // Additional logic for when the call is declined
    }
  };

  const onHangup = () => {
    const call = client.getCall(callId);
    if (call) {
      call.hangup();
      // Additional logic for when the call is hung up
    }
  };

  return (
    <div className='flex items-center justify-between max-w-md p-4 mx-auto text-white bg-gray-800 rounded-lg shadow-md'>
      <div className='flex items-center'>
        <div className='p-2 bg-purple-600 rounded-full'>
          <FaMicrophone />
        </div>
        <div className='ml-4'>
          <p className='font-semibold'>{sender}</p>
          <p>Video call</p>
        </div>
      </div>
      <div className='flex'>
        {callStatus === "ringing" && (
          <button
            className='p-2 mx-1 transition duration-300 bg-green-600 rounded-full hover:bg-green-700'
            onClick={onAnswer}
          >
            <FaPhone />
          </button>
        )}
        {callStatus === "ringing" && (
          <button
            className='p-2 mx-1 transition duration-300 bg-red-600 rounded-full hover:bg-red-700'
            onClick={onDecline}
          >
            <FaPhoneSlash />
          </button>
        )}
        {callStatus === "active" && (
          <button
            className='p-2 mx-1 transition duration-300 bg-red-600 rounded-full hover:bg-red-700'
            onClick={onHangup}
          >
            <FaPhoneSlash />
          </button>
        )}
        {callStatus === "ended" && <p>Call ended</p>}
      </div>
    </div>
  );
}

export default VideoMessage;
