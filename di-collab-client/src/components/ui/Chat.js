import React, { useEffect, useState, useRef } from "react";
import { useClient } from "../../providers/ClientProvider";
import { useRoom } from "../../providers/RoomProvider";
import Message from "./Message";
import {
  FiSend,
  FiHome,
  FiHeadphones,
  FiMic,
  FiMicOff,
  FiCamera,
  FiCameraOff,
} from "react-icons/fi";
import ChatDate from "./ChatDate";

function Chat() {
  const { client } = useClient();
  const {
    setRoomId,
    roomId,
    messages,
    setMessages,
    message,
    setMessage,
    room,
    setRoom,
    mic,
    setMic,
    cam,
    setCam,
    audio,
    setAudio,
    replying,
    setReplying,
    parentUser,
    setParentUser,
  } = useRoom();
  const [loadMessages, setLoadMessages] = useState(false);
  const [typing, setTyping] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const getRoomMembers = (room) => {
      const members = room.getMembers();
      return members.filter((member) => {
        const user = client.getUser(member.userId);
        return user && user.presence === "online";
      });
    };

    const setupEventListeners = () => {
      client.on("Room.typing", (event, room) => {
        if (room.roomId === roomId) {
          setTyping(event.userIds[0]);
        }
      });

      client.on("sync", (state) => {
        if (state === "PREPARED") {
          if (room) {
            const timeline = room.getLiveTimeline();
            const events = timeline.getEvents();
            setMessages(events);
            const onlineMembers = getRoomMembers(room);
            console.log("Online members:", onlineMembers);
          }
        }
      });
    };

    if (roomId) {
      setupEventListeners();
    }

    // Cleanup
    return () => {
      client.removeAllListeners("Room.typing");
      client.removeAllListeners("sync");
    };
  }, [client, roomId, setRoom, setMessages]);

  useEffect(() => {
    if (roomId) {
      const getRoomHistory = () => {
        const room = client.getRoom(roomId);
        setRoom(room);
        if (room) {
          const timeline = room.getLiveTimeline();
          const events = timeline.getEvents();
          console.log(events);
          setMessages(events);
        }
      };

      getRoomHistory();
    } else {
      console.log("no room id");
    }
  }, [client, roomId, room, loadMessages !== false]);

  useEffect(() => {
    const isScrollAtTop = () => {
      if (scrollRef.current) {
        const { scrollTop } = scrollRef.current;
        return scrollTop === 0;
      }
      return false;
    };

    // Example usage
    const handleScroll = () => {
      if (isScrollAtTop()) {
        setLoadMessages(true);
      } else {
        setLoadMessages(false);
      }
    };

    // Attach scroll event listener
    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", handleScroll);
    }

    // Clean up the scroll event listener
    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleAudio = () => {
    if (mic) {
      setMic(false);
    }
    if (cam) {
      setCam(false);
    }
    if (!audio) {
      setMic(true);
    }
    setAudio(!audio);
  };

  const handleMic = () => {
    if (!audio) {
      if (!mic) {
        setMic(true);
        setAudio(true);
      }
    } else {
      setMic(!mic);
    }
  };

  const handleCam = () => {
    if (!audio) {
      if (!mic) {
        setCam(true);
        setAudio(true);
      }
    } else {
      setCam(!cam);
    }
  };

  const exitRoom = () => {
    setMessages([]);
    setRoomId(null);
  };

  const getEvent = (eventId) => {
    if (room) {
      const event = room.findEventById(eventId);
      console.log(event);
      return event;
    }

    return null;
  };

  const constructFormattedBody = () => {
    const event = getEvent(replying);
    if (event) {
      const replyToLink = `https://matrix.to/#/${event.event.room_id}/${event.event.event_id}`;
      const replyToUserLink = `https://matrix.to/#/${event.sender}`;
      const replyToUserName = event.sender.name ?? event.sender.userId;
      const replyToMessage =
        event.event.content.body ?? event.content.memebership;
      const senderMessage = message;

      const formattedBody = `<mx-reply><blockquote><a href="${replyToLink}">In reply to</a> <a href="${replyToUserLink}">${replyToUserName}</a><br />${replyToMessage}</blockquote></mx-reply>${senderMessage}`;
      return formattedBody;
    }
  };

  const handleReply = async (event) => {
    event.preventDefault();
    const formattedMessage = constructFormattedBody();
    if (message.trim() !== "") {
      client.sendEvent(roomId, "m.room.message", {
        body: message,
        formatted_body: formattedMessage,
        msgtype: "m.text",
        "m.relates_to": {
          "m.in_reply_to": {
            event_id: replying,
          },
        },
      });
      setMessage("");
      setReplying("");
      setParentUser("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (message.trim() !== "") {
      client.sendEvent(roomId, "m.room.message", {
        body: message,
        msgtype: "m.text",
      });
      console.log(message);
      setMessage("");
    }
  };

  return (
    <div>
      <div
        className='w-full mt-3 overflow-auto max-h-96 custom-scrollbar'
        ref={scrollRef}
      >
        {messages?.map((message, index) => {
          const currentMessageDate = new Date(
            message.event.origin_server_ts
          ).toLocaleDateString();
          const previousMessageDate =
            index > 0
              ? new Date(
                  messages[index - 1].event.origin_server_ts
                ).toLocaleDateString()
              : null;

          return (
            <React.Fragment key={index}>
              {currentMessageDate !== previousMessageDate && (
                <ChatDate date={currentMessageDate} />
              )}
              <Message message={message} index={index} />
            </React.Fragment>
          );
        })}
      </div>
      <div className='w-full pt-2'>
        <form
          onSubmit={replying !== "" ? handleReply : handleSubmit}
          className='flex w-full'
        >
          <div className='w-full'>
            <input
              className='w-5/6 max-w-full max-h-full p-1 mr-2 text-black'
              placeholder='Start typing....'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button
            type='submit'
            className='p-2 border rounded-full cursor-pointer bg-slate-700 hover:bg-logoBackdrop'
            disabled={message !== "" ? false : true}
          >
            <FiSend />
          </button>
          <button
            type='button'
            className='p-2 ml-2 border rounded-full cursor-pointer bg-slate-700 hover:bg-logoBackdrop'
            onClick={exitRoom}
          >
            <FiHome />
          </button>
        </form>
        <div className='flex flex-row mt-2'>
          <button
            type='button'
            className={
              audio
                ? "p-2 border rounded-full cursor-pointer bg-slate-700 hover:bg-logoBackdrop"
                : "p-2 border rounded-full cursor-pointer bg-red-700 hover:bg-red-800"
            }
            onClick={handleAudio}
          >
            <FiHeadphones />
          </button>
          <button
            type='button'
            className='p-2 ml-2 border rounded-full cursor-pointer bg-slate-700 hover:bg-logoBackdrop'
            onClick={handleMic}
          >
            {mic ? <FiMic /> : <FiMicOff />}
          </button>
          <button
            type='button'
            className='p-2 ml-2 border rounded-full cursor-pointer bg-slate-700 hover:bg-logoBackdrop'
            onClick={handleCam}
          >
            {cam ? <FiCamera /> : <FiCameraOff />}
          </button>
          {parentUser ? (
            <div className='flex items-center px-1 ml-2 rounded-md bg-slate-700'>
              <p className='text-sm break-words'>{parentUser}:</p>
              <button
                className='w-8 p-1 ml-2 rounded-full bg-logoBackdrop'
                onClick={() => setParentUser("")}
              >
                X
              </button>
            </div>
          ) : null}
        </div>
      </div>
      {typing ?? <p>{typing}</p>}
    </div>
  );
}

export default Chat;
