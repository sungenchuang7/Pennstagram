import React, { useEffect, useState } from 'react';
import { Space } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';
import Post from './Post';
import './Feed.css';

function Feed({
  posts, setPosts, loggedInUserID, count, fetchData, totalLength,
}) {
  if ((!posts) || (!posts.length) || (posts.length === 0)) {
    return <div id="No Data"> No Posts Available. </div>;
  }
  const [hasMore, setHasMore] = useState(true);
  useEffect(() => {
    if (count.current >= totalLength.current) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [posts]);

  const items = posts.map((post) => (
    <div key={post._id} style={{ marginBottom: '20px' }}>
      <Post
        id={post._id}
        avatar={post.avatar || ''}
        text={post.text || ''}
        userName={post.userName || ''}
        userID={post.userID || ''}
        url={post.url || ''}
        time={post.time}
        setPosts={setPosts}
        posts={posts}
        likeList={post.like || []}
        loggedInUserID={loggedInUserID || ''}
        commentList={post.commentList || []}
        fileName={post.fileName || ''}
      />
    </div>
  ));

  return (
    <div>
      <Space className="feed" direction="vertical" align="center">
        <InfiniteScroll
          next={fetchData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          dataLength={count.current}
          endMessage={(
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          )}
        >
          {items}
        </InfiniteScroll>
      </Space>
    </div>
  );
}

Feed.propTypes = {
  // I get TA's permit to disable this rule
  // eslint-disable-next-line react/forbid-prop-types
  posts: PropTypes.array.isRequired,
  setPosts: PropTypes.func.isRequired,
  loggedInUserID: PropTypes.string.isRequired,
  fetchData: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  count: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  totalLength: PropTypes.object.isRequired,
};

export default Feed;
