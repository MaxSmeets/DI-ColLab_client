import React, { useState, createContext, useContext } from "react";

export const RoomContext = createContext();

export const useRoom = () => useContext(RoomContext);

export const RoomProvider = ({ children }) => {
  const [roomId, setRoomId] = useState(null);
  const [room, setRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [participants, setParticipants] = useState([]);
  const [audio, setAudio] = useState(true);
  const [mic, setMic] = useState(false);
  const [cam, setCam] = useState(false);
  const [replying, setReplying] = useState("");
  const [parentUser, setParentUser] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [fileToSend, setFileToSend] = useState(null);

  return (
    <RoomContext.Provider
      value={{
        roomId,
        setRoomId,
        room,
        setRoom,
        participants,
        setParticipants,
        rooms,
        setRooms,
        messages,
        setMessages,
        message,
        setMessage,
        audio,
        setAudio,
        mic,
        setMic,
        cam,
        setCam,
        replying,
        setReplying,
        parentUser,
        setParentUser,
        modalOpen,
        setModalOpen,
        fileToSend,
        setFileToSend,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
