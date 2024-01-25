import React, { useEffect } from "react";
import { useClient } from "../../providers/ClientProvider";
import { useRoom } from "../../providers/RoomProvider";
import { FiArrowRightCircle } from "react-icons/fi";

function Rooms() {
  const { client } = useClient();
  const { rooms, setRooms, roomId, setRoomId } = useRoom();

  useEffect(() => {
    async function getRooms() {
      const response = await client.publicRooms(function (err, data) {
        console.log("Public Rooms: %s", JSON.stringify(data));
      });
      setRooms(response.chunk);
    }
    getRooms();
  }, []);

  async function joinRoom(room) {
    try {
      if (!roomId) {
        await client.joinRoom(room);
      }
      setRoomId(room);
    } catch (error) {
      console.error("Failed to join room", error);
    }
  }

  return (
    <div className='h-screen mt-1'>
      <p className='text-md'>Rooms:</p>{" "}
      <div className='overflow-visible'>
        {rooms.map((room) => (
          <div
            key={room.room_id}
            className='flex items-center justify-between p-3 overflow-hidden text-white border border-slate-500 custom-scrollbar'
          >
            <div>
              <p className='text-sm font-extrabold'>{room.name}</p>
              <p className='text-sm'>Members: {room.num_joined_members}</p>
            </div>
            <button className='m-1' onClick={() => joinRoom(room.room_id)}>
              <FiArrowRightCircle size={30} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Rooms;
