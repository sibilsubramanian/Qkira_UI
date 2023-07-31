import { useEffect } from "react";
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';

import "./oldComment.scss";

const OldComment = (props) => {
    const generateAvatar = (userName) => {
        let avatar = createAvatar(initials, {
          seed: userName
        });
    
        var container = document.getElementById(`old-${props.SK}`);
        if (container) container.innerHTML = avatar.toJson().svg;
    };

    useEffect(() => {
        props?.commenterName && generateAvatar(props.commenterName);
    }, [props.commenterName]);
    
    return <div className="old-comments" key={props.SK}>
        <div id={`old-${props.SK}`} className="avator-comments"></div>
        <div className="content">
            <div className="date">{props.commenterName.toUpperCase() + ", "}{new Date(props.commentedDate).toLocaleString()}</div>
            <div className="data">{props.comment}</div>
        </div>
    </div>
};

export default OldComment;
