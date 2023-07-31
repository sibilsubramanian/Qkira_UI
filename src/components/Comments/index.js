import { useState, useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

import NewComment from "../NewComment";
import OldComment from "../OldComment";
import { getComments } from "../../Services";

import "./comments.scss";
import { Fragment } from "react";

const Comments = (props) => {
  const [commentList, setCommentList] = useState([]);
  const [loadedPage, setLoadedPage] = useState(0);
  const [evaluatedKey, setLastEvaluatedKey] = useState(null);
  const [previousId, setPreviousId] = useState(null);

  const fetchComments = async (size = 5, reset = false) => {
    let payload = {
      key: props.id,
      pageSize: size,
      ...(evaluatedKey !== null ? { exclusiveStartKey: evaluatedKey } : {}),
    };

    let response = await getComments(payload);
    if (response) {
      setLoadedPage(loadedPage + 5);
      setCommentList(
        reset ? [...response.data] : [...commentList, ...response.data]
      );
      setLastEvaluatedKey(response.lastEvaluatedKey || null);
    }
  };

  const reloadLoadedComments = () => {
    let size = loadedPage > 0 ? loadedPage : 5;
    setCommentList([]);
    setLastEvaluatedKey(null);
    fetchComments(size, true);
  };

  useEffect(() => {
    if (!previousId || previousId !== props.id) {
      fetchComments(5, true);
      setPreviousId(props.id);
    } else {
      fetchComments();
    }
  }, [props.id]);

  return (
    <div className="comments">
      <NewComment id={props.id} onReload={reloadLoadedComments} />
      <div className="comments-title">Comments</div>
      <div className="comments-container">
        {commentList?.map((item) => (
          <Fragment key={item.SK}>
            <OldComment {...item} />
          </Fragment>
        ))}
      </div>
      {evaluatedKey && (
        <div className="loadmore" onClick={() => fetchComments()}>
          Load more comments <MdKeyboardArrowDown />
        </div>
      )}
    </div>
  );
};

export default Comments;
