import React, {useState, useEffect} from 'react';
import useWebSocket, {ReadyState} from 'react-use-websocket';
import {webSocketURL} from "../Stack";

export const newUUID = crypto.randomUUID()

export const Socket = ({addPlayer, removePlayer}) => {
    const [socketUrl, setSocketUrl] = useState(webSocketURL);
    const {readyState, lastMessage, sendMessage, getWebSocket} = useWebSocket(socketUrl, {share: true});
    useEffect(() => {
        if (readyState === ReadyState.OPEN) {
            console.log('WebSocket connection established.');
            const initialMessage = `N,${newUUID},0,0,0`;
            console.log(`Connected with UUID ${newUUID}`);
            console.log(`Sending initial message to server: ${initialMessage}`);
            sendMessage(initialMessage);
        }
    }, [readyState, ReadyState]);
    useEffect(() => {
        if (lastMessage !== null) {
            const splitEventData = lastMessage.data.split(',');
            const receivedUUID = splitEventData[1];
            if (receivedUUID !== newUUID) {
                const command = splitEventData[0];
                const posX = splitEventData[2];
                const posY = splitEventData[3];
                if (command === 'N') {
                    console.log(`New player with UUID ${receivedUUID}`)
                    addPlayer(receivedUUID, posX, posY);
                }
                if (command === 'C') {
                    console.log(`Deleting player with UUID ${receivedUUID}`)
                    removePlayer(receivedUUID);
                }
            }
        }
    }, [lastMessage]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    return (
        <div>
            <span>The WebSocket is currently {connectionStatus}</span>
        </div>
    );
};