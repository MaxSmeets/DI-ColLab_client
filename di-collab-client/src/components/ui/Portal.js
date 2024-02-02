import React, {useEffect, useState} from 'react';
import {Sprite} from "@pixi/react";
import {GRID_SIZE} from "./Grid";

const PORTAL_IMAGE = 'sprite/portal.png';
const PORTAL_ENABLED_IMAGE = 'sprite/portal_enabled.png';

export const PORTAL_X = 400
export const PORTAL_Y = 300

function Portal({enablePortal}) {
    let [portalImage, setPortalImage] = useState(PORTAL_IMAGE)

    useEffect(() => {
        if(enablePortal) {
            setPortalImage(PORTAL_ENABLED_IMAGE)
        }
        else {
            setPortalImage(PORTAL_IMAGE)
        }
    }, [enablePortal]);

    return         <Sprite
        image={portalImage}
        x={PORTAL_X}
        y={PORTAL_Y}
        width={GRID_SIZE * 3}
        height={GRID_SIZE * 3}/>;
}

export default Portal;
