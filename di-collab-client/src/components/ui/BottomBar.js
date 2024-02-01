import { useRoom } from "../../providers/RoomProvider";
import { useUser } from "../../providers/UserProvider";
import React, { useEffect, useRef } from "react";
import WebcamStream from "./WebcamStream";
import ExternalWebcamStream from "./ExternalWebcamSteam";

function BottomBar() {
  const { cam, mic, audio, participants } = useRoom();
  const { volume, setVolume } = useUser();
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (cam) {
          videoRef.current.srcObject = stream;
        } else {
          stream.getTracks().forEach((track) => {
            track.stop();
            stream.removeTrack(track);
          });
        }
      })
      .catch((error) => {
        console.error("Error accessing webcam:", error);
      });
  }, [cam]);

  return (
    <div className='flex flex-row justify-start w-screen overflow-x-hidden'>
      <WebcamStream videoRef={videoRef} />
      {/* {participants.map((participant) => (
        <ExternalWebcamStream
          key={participant.id}
          participant={participant}
          videoRef={videoRef}
        />
      ))} */}
      {/* <ExternalWebcamStream externalUsername='JuleanCodes' />
      <ExternalWebcamStream externalUsername='SanderLienaerts' />
      <ExternalWebcamStream externalUsername='Brandonnn123' />
      <ExternalWebcamStream externalUsername='ShiroInoue' />
      <ExternalWebcamStream externalUsername='Takahiro' />
      <ExternalWebcamStream externalUsername='Marcelke' /> */}
    </div>
  );
}

export default BottomBar;
