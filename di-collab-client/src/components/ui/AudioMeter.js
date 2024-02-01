import React, { useRef, useEffect, useState } from "react";
import { useUser } from "../../providers/UserProvider";
import { useRoom } from "../../providers/RoomProvider";

const settings = {
  bars: 27,
  spacing: 2,
  width: 5,
  height: 0,
};

function AudioMeter() {
  const [audioContext, setAudioContext] = useState(null);
  const { setVolume } = useUser();
  const { mic } = useRoom();

  const volumeRefs = useRef([]);
  volumeRefs.current = volumeRefs.current.slice(0, settings.bars);

  useEffect(() => {
    let animationFrameId;
    let analyser;
    let source;

    if (mic) {
      const newAudioContext = new window.AudioContext();
      setAudioContext(newAudioContext);

      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(function (stream) {
          if (!newAudioContext) return; // Check if context is still valid
          source = newAudioContext.createMediaStreamSource(stream);
          analyser = newAudioContext.createAnalyser();
          analyser.fftSize = 2048;
          source.connect(analyser);

          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          function analyzeVolume() {
            analyser.getByteFrequencyData(dataArray);

            dataArray.forEach((value, index) => {
              if (volumeRefs.current[index]) {
                volumeRefs.current[index].style.height = `${value / 5}px`;
                setVolume(value);
              }
            });

            animationFrameId = requestAnimationFrame(analyzeVolume);
          }

          analyzeVolume();
        })
        .catch(function (err) {
          console.error("Error accessing microphone: ", err);
        });
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      source?.disconnect();
      analyser?.disconnect();
      if (audioContext && audioContext.state !== "closed") {
        audioContext.close();
      }
    };
  }, [mic]); // Dependency array to re-run effect when `mic` changes

  const createElements = () => {
    return Array.from({ length: settings.bars }, (_, i) => (
      <div
        ref={(el) => (volumeRefs.current[i] = el)}
        key={`bar-${i}`}
        className='w-full bg-white rounded' // Tailwind classes for styling
        style={{
          height: "0px", // Initially zero height
          position: "relative",
          background: "rgba(173, 216, 230, 0.3)",
          borderRadius: `${settings.width}px ${settings.width}px 0px 0px`,
          bottom: "0px",
        }}
      />
    ));
  };

  return (
    <div className='flex items-end justify-center w-full h-full'>
      {createElements()}
    </div>
  );
}

export default AudioMeter;
