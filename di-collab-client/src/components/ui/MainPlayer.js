import React, {useState, useEffect} from 'react';
import {Sprite} from "@pixi/react";
import {GRID_SIZE} from "./Grid";
import {screenWidth, screenHeight, webSocketURL} from "../Stack";
import useWebSocket from "react-use-websocket";
import {newUUID} from "./Socket";
import {useUser} from "../../providers/UserProvider";

const PLAYER_IMAGE = 'sprite/player.png';
const PLAYER_SPEAKING_IMAGE = 'sprite/player_speaking.png';

function MainPlayer({player_x, player_y}) {
    let [playerPosition, setPlayerPosition] = useState({x: player_x, y: player_y});
    let [playerImage, setPlayerImage] = useState(PLAYER_IMAGE)
    let [playerSpeaking, setPlayerSpeaking] = useState(false)
    const {sendMessage} = useWebSocket(webSocketURL, {share: true});
    const {volume, volumeThreshold} = useUser()

    function canMoveTo(targetX, targetY) {
        return !(targetX < 0 || targetX >= screenWidth || targetY < 0 || targetY >= screenHeight);
    }
    useEffect( () => {
        const has_volume = volume > volumeThreshold
        if(playerSpeaking !== has_volume) {
            setPlayerSpeaking(volume > volumeThreshold);
            sendMessage("P," + newUUID + "," + playerPosition.x + "," + playerPosition.y + "," + (has_volume ? 1 : 0));
        }
    }, [volume])
    useEffect(() => {
        const handleKeyDown = (event) => {
            let targetX = playerPosition.x;
            let targetY = playerPosition.y;

            switch (event.key.toLowerCase()) {
                case 'arrowup':
                case 'w':
                    targetY -= GRID_SIZE;
                    break;
                case 'arrowdown':
                case 's':
                    targetY += GRID_SIZE;
                    break;
                case 'arrowleft':
                case 'a':
                    // console.log(`MainPlayer has volume: ${volume}`);
                    targetX -= GRID_SIZE;
                    break;
                case 'arrowright':
                case 'd':
                    targetX += GRID_SIZE;
                    break;
                default:
                    break;
            }
            if (canMoveTo(targetX, targetY)) {
                setPlayerPosition({x: targetX, y: targetY});
                sendMessage("P," + newUUID + "," + targetX + "," + targetY + "," + (playerSpeaking ? 1:0));
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [playerPosition]);

    useEffect(() => {
        if(playerSpeaking) {
            setPlayerImage(PLAYER_SPEAKING_IMAGE)
        }
        else {
            setPlayerImage(PLAYER_IMAGE)
        }
    },[playerSpeaking])
    return <Sprite
        image={playerImage}
        x={playerPosition.x}
        y={playerPosition.y}
        width={GRID_SIZE}
        height={GRID_SIZE}
    />;
}

export default MainPlayer;
