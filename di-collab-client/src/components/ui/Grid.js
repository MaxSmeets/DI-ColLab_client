import React, {useCallback} from 'react';
import {Graphics} from "@pixi/react";
import MainPlayer from "./MainPlayer";
import Player from "./Player";

export const GRID_SIZE = 50;
const BORDER_WIDTH = 1;
const GRID_COLOR = 0xFFFFFF;

const Grid = ({ screenWidth, screenHeight, players }) => {
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
    }, [players]);
    return <Graphics draw={draw}>
            <MainPlayer
                player_x={0}
                player_y={0}
            />
            {players.map((player) => (
                <Player
                    key={"player"+player.key}
                    uuid={player.key}
                    player_x={player.x}
                    player_y={player.y}
                />
            ))}
    </Graphics>;
};

export default Grid;
