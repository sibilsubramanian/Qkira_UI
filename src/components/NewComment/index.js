import { useState, useContext, useEffect } from "react";
import { Input, Button } from "reactstrap";
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';

import { addComments } from "../../Services";
import { AppContext } from "../../store/AppContext";

import "./newComment.scss";

const NewComment = (props) => {
    const { userDetails } = useContext(AppContext);
    const [newComment, setNewComment] = useState("");
    const [isDisabled, setDisabled] = useState(false);

    const generateAvatar = (userName) => {
        let avatar = createAvatar(initials, {
          seed: userName
        });
    
        var container = document.getElementById("comments-author-avator");
        if (container) container.innerHTML = avatar.toJson().svg;
    };

    const cancelHandler = () => {
        setNewComment("");
    };

    const addHandler = async() => {
        setDisabled(true);
        let payload = {
            key: props.id,
            comment: newComment
        };

        let response = await addComments(payload);
        if (response) {
            setDisabled(false);
            props.onReload();
            response?.commentId && setNewComment("");
        }
    };

    useEffect(() => {
        userDetails?.email && generateAvatar(userDetails.email);
    }, []);

    return <>
        {userDetails ? <><div className="new-comments">
            <div id="comments-author-avator"></div>
            <Input
                id="newComment"
                name="newComment"
                type="textarea"
                disabled={isDisabled}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Enter your comments..."
            />
        </div>
        <div className="actions">
            <Button disabled={isDisabled} className="add-action" onClick={addHandler}>Add</Button>
            <Button disabled={isDisabled} className="cancel-action" onClick={cancelHandler}>Cancel</Button>
        </div></> : <></>}
    </>
};

export default NewComment;
