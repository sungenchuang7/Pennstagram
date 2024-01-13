import React from 'react';
import {
  Avatar, Button, message, Space,
} from 'antd';
import './Post.css';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { deletePost, getUserData, patchUserData } from '../api/API';
import Like from './Like';
import CommentBox from './CommentBox';
import EditPostButton from './EditPostButton';

function Post({
  // eslint-disable-next-line max-len
  avatar, userName, userID, url, text, time, posts, setPosts, id, likeList, loggedInUserID, commentList, fileName,
}) {
  const deletePostOnClick = async () => {
    try {
      const result = await deletePost(fileName, id);
      if (result[1].status === 200) {
        const newPost = posts.filter((element) => element._id !== id);
        setPosts(newPost);
        message.success('Deleted');
      }
    } catch (e) {
      message.error(`Unable to delete the post, error: ${e.message}`);
    }
  };

  const hidePostOnClick = async () => {
    try {
      // getUserData returns a HTML response
      let res = await getUserData(loggedInUserID);
      [res] = res.data;
      const postsToHide = res.hiddenPosts || [];
      postsToHide.push(id);
      // res = await getUserData(loggedInUserID);
      // [res] = res.data;
      const jsonIdUser = res._id;

      await patchUserData(jsonIdUser, { hiddenPosts: postsToHide });
      // const result = await patchUserData(loggedInUserID, { hiddenPosts: postsToHide });
      // console.log('After calling patchUserData');
      // console.log(`result: ${result}`);
      // console.log("let's check result[1]");
      // console.log('result[1].status: ', result[1]?.status);
      // if (result[1].status === 200) {
      //   const newPost = posts.filter((element) => element._id !== id);
      //   setPosts(newPost);
      //   message.success('Post is successfully hidden!');
      // }
      const newPost = posts.filter((element) => element._id !== id);
      setPosts(newPost);
      message.success('Post is successfully hidden!');
    } catch (e) {
      message.error(`Unable to hide the post, error: ${e.message}`);
    }
  };

  const mediaRenderer = () => {
    // Check if the URL is a YouTube URL
    const isVideo = /\.mp4$/.test(url);

    if (url === '' || url === undefined) {
      return ' ';
    }

    if (isVideo) {
      return (
        <video className="videoPalyer" width="500" height="500" controls>
          <source src={url} type="video/mp4" />
        </video>
      );
    }

    return (
      <div className="container">
        <img
          src={url}
          className="video"
          alt="unable to show"
        />
      </div>
    );
  };

  return (
    <div>
      <div />
      <Space id="post" direction="vertical" align="center">
        <Space className="postHeader" direction="horizontal" align="center">
          <Link to={`/profile/${userID}`}>
            <Avatar className="postAvatar" src={avatar} />
          </Link>
          <div className="postInfoContainer">
            <span className="postUserName">{userName}</span>
            <span className="postUserID">{userID}</span>
            <span className="postTime">{time}</span>
          </div>
        </Space>
        <Space className="postContent" align="center" direction="horizontal">
          {mediaRenderer(url)}
        </Space>
        <p>{text}</p>
        <Like likeList={likeList} id={id} loggedInUserID={loggedInUserID} />
        <CommentBox commentList={commentList} id={id} loggedInUserID={loggedInUserID} />
        {loggedInUserID === userID
          ? <Button id="deleteButton" onClick={deletePostOnClick}>Delete</Button>
          : null}
        {loggedInUserID === userID
          ? (
            <EditPostButton
              userData={{ avatar, userName, userID }}
              activityFeed={posts}
              setActivityFeed={setPosts}
              text={text}
              url={url}
              id={id}
              fileName={fileName}
            />
          )
          : null}
        {((loggedInUserID !== userID))
          ? <Button id="hideButton" onClick={hidePostOnClick}>Hide</Button>
          : null}
      </Space>
      <div />
    </div>
  );
}

Post.propTypes = {
  avatar: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  userID: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  posts: PropTypes.array.isRequired,
  setPosts: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  likeList: PropTypes.array.isRequired,
  loggedInUserID: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  commentList: PropTypes.arrayOf(PropTypes.object).isRequired,
  fileName: PropTypes.string.isRequired,
};

export default Post;
