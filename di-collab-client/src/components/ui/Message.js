import React, { useState } from "react";
import { useUser } from "../../providers/UserProvider";
import { useRoom } from "../../providers/RoomProvider";
import { useClient } from "../../providers/ClientProvider";
import ImageModal from "./ImageModal";
import DOMPurify from "dompurify";
import "../../styles.css";
import { FiAtSign } from "react-icons/fi";
import VideoMessage from "./VideoMessage";

function Message({ message, index }) {
  const { client } = useClient();
  const { userId } = useUser();
  const { messages, setReplying, setParentUser, modalOpen, setModalOpen } =
    useRoom();
  const [hovering, setHovering] = React.useState(false);

  function convertUnixToLocal(unixTime) {
    const date = new Date(unixTime);
    const localDateTime = date.toLocaleString();
    const splitTime = localDateTime.split(" ");
    const dateToDisplay = splitTime[0];
    const timeToDisplay = splitTime[1] + " " + splitTime[2];

    return { date: dateToDisplay, time: timeToDisplay };
  }

  function fetchMxcContent(mxcUrl) {
    return client.mxcUrlToHttp(
      mxcUrl,
      window.innerWidth,
      window.innerHeight,
      "scale"
    );
  }

  const { date, time } = convertUnixToLocal(message.event.origin_server_ts);

  function MatrixMessage({ htmlContent }) {
    const sanitizedContent = DOMPurify.sanitize(htmlContent);
    return (
      <div
        className='text-sm'
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    );
  }

  function handleReplySetters(eventId, sender) {
    setReplying(eventId);
    setParentUser(sender);
  }

  function renderMessageContent() {
    const eventType = message.event.type;
    const eventContent = message.event.content;

    if (eventType === "m.room.message") {
      // Check if 'm' and 'm.relates_to' exist before accessing 'm.in_reply_to'
      if (
        eventContent.m?.relates_to &&
        eventContent.m.relates_to["m.in_reply_to"]
      ) {
        // This is a reply message
        return <MatrixMessage htmlContent={eventContent.formatted_body} />;
      } else if (eventContent.msgtype === "m.image") {
        const imageUrl = fetchMxcContent(eventContent.url);
        return (
          <div>
            <img
              onClick={() => setModalOpen(true)}
              src={imageUrl}
              className='object-cover w-full h-full rounded-md cursor-pointer'
            />
            <ImageModal imageSrc={imageUrl} />
          </div>
        );
      } else {
        // Regular message
        return eventContent.formatted_body ? (
          <MatrixMessage htmlContent={eventContent.formatted_body} />
        ) : (
          <p className='text-sm break-words'>{eventContent.body}</p>
        );
      }
    } else if (eventType === "m.room.member") {
      // Membership change event (e.g., join, leave)
      const membership = eventContent.membership.split(" ");
      return eventContent.displayname !== message.sender.name ? (
        <p className='text-sm break-words'>{`${message.sender.name} changed their display name to ${eventContent.displayname}`}</p>
      ) : (
        <p className='text-sm break-words'>{` ${
          membership[membership.length - 1]
        }`}</p>
      );
    } else if (eventType === "m.reaction") {
      // Reaction, the child of parent message
      const reactionChildId = eventContent.event_id;
      // Find the parent message
      for (const parentMessage of messages) {
        if (
          parentMessage.event.content?.["m.relates_to"]?.event_id ===
          reactionChildId
        ) {
          return (
            <div>
              {parentMessage.event.content?.["m.relates_to"]?.rel_type ===
              "m.annotation" ? (
                <div>
                  <p className='text-sm bg-red-500'>
                    {parentMessage.event.content["m.relates_to"].key}
                  </p>
                  <p className='text-sm bg-green-500'>
                    {eventContent?.["m.relates_to"]?.key}
                  </p>
                </div>
              ) : (
                <p className='text-sm '>
                  {eventContent?.["m.relates_to"]?.key}
                </p>
              )}
            </div>
          );
        }
      }

      return (
        <div className='flex items-center justify-center'>
          <p className='text-sm'>{eventContent?.["m.relates_to"]?.key}</p>
          <p className='text-sm'>{eventContent?.["m.relates_to"]?.rel_type}</p>
        </div>
      );
    } else if (eventType === "m.call.hangup") {
      return (
        <VideoMessage
          sender={message.sender.name}
          callId={message.event.call_id}
          callStatus='ended'
        />
      );
    } else if (eventType === "m.call.invite") {
      return (
        <VideoMessage
          sender={message.sender.name}
          callId={message.event.call_id}
          callStatus='ringing'
        />
      );
    } else if (eventType === "m.call.candidates") {
      return (
        <VideoMessage
          sender={message.sender.name}
          callId={message.event.call_id}
          callStatus='candidates'
        />
      );
    } else {
      // Other event types
      return <p>Unsupported event type</p>;
    }
  }

  return message.event.type === "m.room.redaction" ||
    message.event.content === null ? (
    <div />
  ) : (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className='flex items-center w-full '
    >
      {message.event.sender === userId ? (
        hovering ? (
          <button
            onClick={() =>
              handleReplySetters(message.event.event_id, message.event.sender)
            }
          >
            <FiAtSign className='p-1 ml-2 border rounded-full cursor-pointer w-7 h-7 bg-slate-700 hover:bg-logoBackdrop' />
          </button>
        ) : (
          <div />
        )
      ) : (
        <div />
      )}
      <div
        key={index}
        className={
          message.event.sender === userId
            ? "ml-auto w-5/6 m-1 rounded-md  right-0 bg-logoBackdrop mb-4"
            : "w-5/6 m-1 rounded-md bg-logoBackdrop mb-4"
        }
      >
        <p className='mx-2 mt-1 font-bold break-words text-md'>
          {message.event.sender === userId
            ? "You"
            : message.sender.name ?? message.sender.userId}
        </p>
        <div
          className={
            hovering ? "bg-slate-700 w-full p-2 rounded-md" : "w-full p-2"
          }
        >
          {renderMessageContent()}
          <p className='ml-auto text-sm italic font-light'>{time}</p>
        </div>
      </div>
      {message.event.sender !== userId ? (
        hovering ? (
          <button
            onClick={() =>
              handleReplySetters(message.event.event_id, message.event.sender)
            }
          >
            <FiAtSign className='p-1 ml-2 border rounded-full cursor-pointer w-7 h-7 bg-slate-700 hover:bg-logoBackdrop' />
          </button>
        ) : (
          <div />
        )
      ) : (
        <div />
      )}
    </div>
  );
}

export default Message;
