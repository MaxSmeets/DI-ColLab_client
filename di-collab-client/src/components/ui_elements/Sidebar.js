import React from "react";
import Chatroom from "../communication/Chatroom";

function Sidebar() {
  return (
    <div className='relative float-right w-1/5 h-full p-2 m-0 overflow-hidden bg-gray-300'>
      <Chatroom />
    </div>
  );
}

export default Sidebar;
