import React, {useEffect, useState} from 'react';
import {Sprite} from "@pixi/react";
import {GRID_SIZE} from "./Grid";
import {webSocketURL} from "../Stack";
import useWebSocket from "react-use-websocket";

const PLAYER_IMAGE = 'sprite/player.png';
const PLAYER_SPEAKING_IMAGE = 'sprite/player_speaking.png';

const Player = ({uuid, player_x, player_y}) => {
    let [playerPosition, setPlayerPosition] = useState({x: player_x, y: player_y});
    let [playerUUID, setPlayerUUID] = useState(uuid);
    let [playerImage, setPlayerImage] = useState(PLAYER_IMAGE)
    let [playerSpeaking, setPlayerSpeaking] = useState(false);
    const {lastMessage} = useWebSocket(webSocketURL, {share: true});
    useEffect(() => {
        if (lastMessage !== null) {
            const splitEventData = lastMessage.data.split(',');
            const receivedUUID = splitEventData[1];
            if(receivedUUID === playerUUID) {
                const command = splitEventData[0];
                const posX = splitEventData[2];
                const posY = splitEventData[3];
                const speaking = splitEventData[4];
                if (command === 'P') {
                    setPlayerPosition({x: posX, y: posY});
                    setPlayerSpeaking(speaking === '1')
                }
            }
        }
    }, [lastMessage]);

    useEffect(() => {
        if(playerSpeaking) {
            setPlayerImage(PLAYER_SPEAKING_IMAGE)
        }
        else {
            setPlayerImage(PLAYER_IMAGE)
        }
    },[playerSpeaking])

    return <Sprite
        key={playerUUID}
        image={playerImage}
        x={playerPosition.x}
        y={playerPosition.y}
        width={GRID_SIZE}
        height={GRID_SIZE}
    />;
};
export default Player;
