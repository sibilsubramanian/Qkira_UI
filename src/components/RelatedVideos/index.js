import { memo, useEffect, useState } from "react";
import { getPublishedVideos } from "../../Services";
import InfiniteScroll from "react-infinite-scroll-component";

import "./relatedVideos.scss";

const RelatedVideos = memo(({ category, selectedVideo, selectVideo }) => {
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [indexKey, setIndexKey] = useState(null);

  async function fetchRelevantVideos(category) {
    const response = await getPublishedVideos(category, 9, indexKey);
    const relevantVideos = response?.items?.filter(
      (video) => video.key !== selectedVideo
    );
    setRelatedVideos([...relatedVideos, ...relevantVideos]);
    if (response.lastEvaluatedKey) {
      setIndexKey(response.lastEvaluatedKey?.key);
    } else {
      setIndexKey(null);
    }
  }

  useEffect(() => {
    if (category && selectedVideo) {
      fetchRelevantVideos(category);
    }
  }, [category, selectedVideo]);

  return (
    <div className="related-videos">
      <div className="title">Related Videos</div>
      <InfiniteScroll
        dataLength={relatedVideos.length}
        next={() => fetchRelevantVideos(category)}
        hasMore={Boolean(indexKey)}
        loader={<p>Loading...</p>}
        scrollableTarget="scrollable-div"
      >
        {relatedVideos.map((video) => (
          <div
            key={video.key}
            className="video-item"
            onClick={() => {
              selectVideo(video, category);
            }}
          >
            <img
              width={150}
              height={150}
              alt={video.videoName}
              src={video.imageKey}
            />
            <div className="video-text-details">
              <h6>{video.videoName}</h6>
              {video?.uploaderDetails?.uploaderName && (
                <p className="video-text">
                  {video.uploaderDetails.uploaderName}
                </p>
              )}
              {video?.dateUploaded && (
                <p className="video-text">
                  {new Date(video.dateUploaded).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
});

export default RelatedVideos;
