import React, {useCallback, useEffect, useState} from 'react';
import {Graphics} from "@pixi/react";
import MainPlayer from "./MainPlayer";
import Player from "./Player";
import Portal, {PORTAL_X, PORTAL_Y} from "./Portal";

export const GRID_SIZE = 50;
const BORDER_WIDTH = 1;
const GRID_COLOR = 0xFFFFFF;

const Grid = ({screenWidth, screenHeight, players}) => {
    let [enablePortal, setEnablePortal] = useState(false)

    const draw = useCallback((graphics) => {
        graphics.clear();
        graphics.lineStyle(BORDER_WIDTH, GRID_COLOR, 1);
        for (let x = 0; x <= screenWidth; x += GRID_SIZE) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, screenHeight);
        }
        for (let y = 0; y <= screenHeight; y += GRID_SIZE) {
            graphics.moveTo(0, y);
            graphics.lineTo(screenWidth, y);
        }
    }, []);

    useEffect(() => {
        const vicinityThreshold = 50; // You can adjust this value as per your requirement
        const isAnyPlayerInVicinity = players.some(player => {
            const distance = Math.sqrt(Math.pow((player.x - PORTAL_X), 2) + Math.pow((player.y - PORTAL_Y), 2));
            return distance <= vicinityThreshold;
        });

        if (isAnyPlayerInVicinity) {
            setEnablePortal(true)
        }
        else {
            setEnablePortal(false)
        }
        console.log(`portal state ${enablePortal}`)
    }, [players]);
    return <Graphics draw={draw}>
        <MainPlayer
            player_x={0}
            player_y={0}
        />
        <Portal enablePortal={enablePortal}/>

        {players.map((player) => (
            <Player
                key={"player" + player.key}
                uuid={player.key}
                player_x={player.x}
                player_y={player.y}
            />
        ))}

    </Graphics>;
};

export default Grid;
