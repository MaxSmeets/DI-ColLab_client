import { Stage as PixiStage } from '@pixi/react';
import React from "react";
import {ContextBridge} from "./ContextBridge";
import {UserContext} from "../../providers/UserProvider";


export const Stage = ({ children, ...props }) => {
    return (
        <ContextBridge
            Context={UserContext}
            render={(children) => <PixiStage {...props}>{children}</PixiStage>}
        >
            {children}
        </ContextBridge>
    );
};