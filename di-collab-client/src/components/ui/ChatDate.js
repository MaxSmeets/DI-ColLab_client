import React from "react";

function ChatDate({ date }) {
  return (
    <div className='flex items-center justify-center w-full h-8 mb-3 text-white rounded-md bg-slate-700'>
      <p>{date}</p>
    </div>
  );
}

export default ChatDate;
