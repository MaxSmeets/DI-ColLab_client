import React from "react";
import Webcam from "react-webcam";

function WebcamSm({ audio }) {
  return (
    <div className='w-16 h-9'>
      <Webcam audio={audio} />
    </div>
  );
}

export default WebcamSm;
