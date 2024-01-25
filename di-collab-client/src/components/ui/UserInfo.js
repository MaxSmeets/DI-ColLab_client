import React from "react";
import { useUser } from "../../providers/UserProvider";
import { useClient } from "../../providers/ClientProvider";
import { useRoom } from "../../providers/RoomProvider";
import { FiLogOut } from "react-icons/fi";

function UserInfo() {
  const { username, setUsername, setUserId, setToken, setDeviceId } = useUser();
  const { client, setClient } = useClient();
  const { setRoom } = useRoom();
  const [loading, setLoading] = React.useState(false);
  async function logout(client) {
    try {
      setLoading(true);
      await client.stopClient();
      setToken(null);
      setUsername(null);
      setDeviceId(null);
      setUserId(null);
      setRoom(null);
      setClient(null);
      setLoading(false);
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  }
  return (
    <div className='pb-2 break-words'>
      <div className='flex items-center justify-between'>
        <p>Logged in as: {username}</p>
        <p>
          <button
            className='p-2 ml-2 border rounded-full cursor-pointer bg-slate-700 hover:bg-logoBackdrop'
            onClick={() => logout(client)}
            disabled={loading}
          >
            <FiLogOut />
          </button>
        </p>
      </div>
    </div>
  );
}

export default UserInfo;
