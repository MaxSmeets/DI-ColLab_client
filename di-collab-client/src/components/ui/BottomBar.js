import { useRoom } from "../../providers/RoomProvider";
import React, { useEffect, useRef } from "react";
import WebcamStream from "./WebcamStream";

function BottomBar() {
  const { cam, mic, audio } = useRoom();
  const videoRef = useRef(null);

  useEffect(() => {
    if (cam) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((error) => {
          console.error("Error accessing webcam:", error);
        });
    }
  }, [cam]);

  return (
    <div className='flex flex-row justify-start w-screen overflow-x-hidden'>
      <WebcamStream videoRef={videoRef} />
      <WebcamStream videoRef={videoRef} />
      <WebcamStream videoRef={videoRef} />
      <WebcamStream videoRef={videoRef} />
      <WebcamStream videoRef={videoRef} />
      <WebcamStream videoRef={videoRef} />
      <WebcamStream videoRef={videoRef} />
    </div>
  );
}

export default BottomBar;
