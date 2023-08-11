import { AiFillEye, AiFillLike, AiOutlineEye } from "react-icons/ai";
import { useEffect, useState, useContext } from "react";
import { createAvatar } from "@dicebear/core";
import { HiCheckCircle } from "react-icons/hi";
import { AiOutlineLike } from "react-icons/ai";
import { initials } from "@dicebear/collection";
import { TiWarningOutline } from "react-icons/ti";
import { RiDeleteBin5Line } from "react-icons/ri";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { useNavigate } from 'react-router'

import Comments from "../Comments";
import RelatedVideos from "../RelatedVideos";
import { AppContext } from "../../store/AppContext";
import {
  getVideo,
  deleteVideoByAdmin,
  deleteVideoByUser,
  getUserMetaVideoDetails,
  likeAction,
  updateViewCount,
} from "../../Services";

import "./detailsModal.scss";
import { Fragment } from "react";

const DetailsModal = (props) => {
  const [data, setData] = useState(null);
  const [isError, setError] = useState(false);
  const [isUserLiked, setUserLiked] = useState(false);
  const [isLiked, setLiked] = useState(false);
  const { userDetails } = useContext(AppContext);
  const [viewCount, setViewCount] = useState(0);
  const navigate = useNavigate();

  const generateAvatar = (userName) => {
    let avatar = createAvatar(initials, {
      seed: userName,
    });

    var container = document.getElementById("author-avator");
    if (container) container.innerHTML = avatar.toJson().svg;
  };

  async function fetchData() {
    let response = await getVideo(props.id);
    if (response?.error) {
      setError(true);
    } else {
      setData(response);
      generateAvatar(response.uploader.uploaderName);
    }
  }

  useEffect(() => {
    fetchData();
  }, [props.id]);

  useEffect(() => {
    if (userDetails) {
      async function fetchLikes() {
        let response = await getUserMetaVideoDetails(props.id);
        if (response) {
          setLiked(response.videoLiked);
          setUserLiked(response.videoLiked);
        }
      }
      fetchLikes();
    }
  }, [props.id, userDetails]);

  const onDeleteHandler = async () => {
    let payload = {
      category: props.category,
      key: props.id,
    };
    let response = '';
    if(userDetails?.role === "ADMIN"){
      response = await deleteVideoByAdmin(payload);
    } else if(userDetails?.role === "USER"){
      response = await deleteVideoByUser(payload);
    }
    if(response) {
      navigate(0);
      props.onClose();
    }
  };

  const onLike = (isLike) => {
    if (userDetails) {
      let payload = {
        key: props.id,
        action: isLike,
      };
      setLiked(isLike);
      likeAction(payload);
    }
  };

  const getLikesCount = () => {
    if (isLiked !== isUserLiked) {
      if (isLiked) {
        return parseInt(data.likes) + 1;
      } else {
        return parseInt(data.likes) - 1;
      }
    }

    return data.likes;
  };

  useEffect(() => {
    if(data?.viewCount) {
      setViewCount(data.viewCount);
    }
  }, [data?.viewCount])

  async function updateViews(key) {
    let response = await updateViewCount(key);
    if (response?.error) {
      setError(true);
    } else {
      setViewCount(response.viewCount);
    }
  }

  return (
    <Modal isOpen={true} className="details-modal">
      <ModalHeader toggle={() => props.onClose()} />
      <ModalBody id="scrollable-div">
        {!isError && data && (
          <main className="video-details">
            <section key={data.videoUrl} className="video-container">
              {data.videoUrl && (
                <video controls onPlay={() => {
                  updateViews(data.key);
                }}>
                  <source src={data.videoUrl} type="video/mp4" />
                </video>
              )}
              <div className="title">{props.title}</div>
              <div className="category">{props.category}</div>
              <span className="category-container">
                <div className="author-details">
                  <div id="author-avator"></div>
                  <div className="user-details">
                    <div className="name">{data?.uploader?.uploaderName}</div>
                    <div className="date">
                      Uploaded: {new Date(props?.uploadedDate).toLocaleString()}
                    </div>
                  </div>
                </div>
                {props.isApproval === false && (
                  <div className="video-analytics">
                    <div className="icon">
                      {isLiked ? (
                        <AiFillLike onClick={() => onLike(false)} />
                        ) : (
                        <AiOutlineLike onClick={() => onLike(true)} />
                      )}
                      <div className="likes-count">{getLikesCount()}</div>
                    </div>
                    <div className="icon">
                      {viewCount ? <AiFillEye /> : <AiOutlineEye />}
                      <div className="view-count">{viewCount}</div>
                    </div>
                  </div>
                )}
                {props?.isApproval === true && (
                  <div className="review">
                    <Button className="accept" onClick={props.onAccept}>
                      <HiCheckCircle />
                      <div>Accept</div>
                    </Button>
                    <Button className="reject" onClick={props.onReject}>
                      <AiOutlineCloseCircle />
                      Decline
                    </Button>
                  </div>
                )}
              </span>
              <div className="description">{props.content}</div>

              {props.isDeletable && (
                <div className="review">
                  <Button className="reject" onClick={onDeleteHandler}>
                    <RiDeleteBin5Line />
                    Delete
                  </Button>
                </div>
              )}
            </section>
            <section className="other">
              <Comments id={props.id} />
              <RelatedVideos
                category={props.category}
                selectedVideo={props.id}
                selectVideo={props.selectVideo}
              />
            </section>
          </main>
        )}
        {isError && (
          <div className="error">
            <TiWarningOutline />
            <div className="message">
              Something went wrong, please try again later.
            </div>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

export default DetailsModal;
