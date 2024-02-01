import React, {useState} from "react";
import Login from "./ui/Login";
import Rooms from "./ui/Rooms";
import BottomBar from "./ui/BottomBar";
import UserInfo from "./ui/UserInfo";
import {useUser} from "../providers/UserProvider";
import {useRoom} from "../providers/RoomProvider";

import Chat from "./ui/Chat";
import {newUUID, Socket} from "./ui/Socket"
import {Stage} from "./ui/Stage";
import Grid from "./ui//Grid";

export const screenWidth = 800;
export const screenHeight = 600;
export const webSocketURL = "ws://127.0.0.1:6969"


function Stack() {
    const {userId} = useUser();
    const {roomId} = useRoom();

    const [players, setPlayers] = useState([]);

    const addPlayer = (uuid, x, y) => {
        const playerExists = players.some(player => player.key === uuid);
        if (!playerExists && uuid !== newUUID) {
            const newPlayer = {key: uuid, x: x, y: y};
            setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
            console.log("Player added:", newPlayer);

        }
    };
    const removePlayer = (uuid) => {
        setPlayers(players.filter(player => player.key !== uuid));
    };

    return (
        <div
            className={
                userId
                    ? "flex items-center w-screen h-screen bg-primary"
                    : "flex items-center w-screen h-screen bg-primary justify-center"
            }
        >
            {userId ? (
                <div className='flex flex-col bg-primary'>
                    <div className='flex flex-row w-full'>
                        <div className='left-0 w-2/5 p-2 overflow-auto text-white custom-scrollbar'>
                            <UserInfo/>
                            {roomId ? <Chat/> : null}
                        </div>
                        <div className='text-white'>
                            <Socket addPlayer={addPlayer} removePlayer={removePlayer}/>
                                <Stage width={screenWidth} height={screenHeight} renderOnComponentChange={true}
                                       options={{backgroundColor: 0x1099bb}}>
                                    <Grid screenWidth={screenWidth} screenHeight={screenHeight} players={players} setPlayers={setPlayers}
                                    />
                                </Stage>
                        </div>
                    </div>
                    <BottomBar/>
                </div>
            ) : (
                <Login/>
            )}
        </div>
    );
}

export default Stack;
