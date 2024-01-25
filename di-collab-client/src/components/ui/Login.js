import React, { useEffect } from "react";
import * as sdk from "matrix-js-sdk";
import { useUser } from "../../providers/UserProvider";
import { useClient } from "../../providers/ClientProvider";
import { useRoom } from "../../providers/RoomProvider";
import logo from "../../assets/DiColLab.png";

function Login() {
  const {
    username,
    setUsername,
    setToken,
    setUserId,
    setDeviceId,
    setRefreshToken,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    warning,
    setWarning,
  } = useUser();

  const { client, setClient } = useClient();

  const { setRoomId } = useRoom();

  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    setClient(sdk.createClient({ baseUrl: "https://matrix.org" }));
  }, []);

  async function login(username, password) {
    try {
      const response = await client.login("m.login.password", {
        user: username,
        password: password,
      });
      setUsername(username);
      setUserId(response.user_id);
      setToken(response.access_token);
      setDeviceId(response.device_id);
      setRefreshToken(response.refresh_token);
      setPassword("");
      setShowPassword(false);
      setWarning("");
      setRoomId(null);

      return response; // return the entire response
    } catch (error) {
      if (
        error.message ===
        "MatrixError: [403] Invalid username or password (https://matrix.org/_matrix/client/v3/login)"
      ) {
        setWarning("Invalid username or password");
      } else {
        setWarning("");
      }
    }
  }
  async function startClient(username, password) {
    setLoading(true);
    const response = await login(username, password);
    if (response) {
      const { user_id, access_token, refresh_token } = response;
      setToken(access_token);
      const client = sdk.createClient({
        baseUrl: "https://matrix.org",
        accessToken: access_token,
        userId: user_id,
        refreshToken: refresh_token,
      });
      setClient(client);
      console.log(client.whoami());
      await client.startClient({ initialSyncLimit: 200 });
      client.publicRooms(function (err, data) {});
      setLoading(false);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    startClient(username, password);
  };

  return (
    <div className='flex items-center justify-center w-1/4 p-6 text-white border-2 border-black rounded-2xl h-3/5 bg-logoBackdrop'>
      <div className='flex flex-col justify-center'>
        <img src={logo} alt='DiColLab' className='mx-auto w-44 h-44' />
        <form onSubmit={handleSubmit} className='my-1'>
          <div className='flex flex-col justify-center'>
            <label className='text-red-600' id='warning'>
              {warning}
            </label>
            <label htmlFor='username'>Username</label>
            <input
              required
              type='text'
              name='username'
              id='username'
              className='w-full py-1 pl-2 pr-10 text-black border border-gray-300 rounded'
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className='flex flex-col justify-center mb-3'>
            <label htmlFor='password'>Password</label>
            <div className='relative w-full'>
              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full py-1 pl-2 pr-10 text-black border border-gray-300 rounded'
              />
              <button
                type='button'
                onMouseDown={() => setShowPassword(true)}
                onMouseUp={() => setShowPassword(false)}
                className='absolute inset-y-0 right-0 flex items-center px-2 text-sm text-gray-500 cursor-pointer'
              >
                {showPassword ? "👁️‍🗨️" : "👁"}
              </button>
            </div>
          </div>
          <div className='flex justify-between'>
            <button
              className='w-20 p-1 border border-white rounded-md cursor-pointer'
              type='submit'
              disabled={loading}
            >
              Login
            </button>
            <button className='w-20 p-1 border border-white rounded-md cursor-pointer'>
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
