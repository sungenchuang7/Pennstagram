import React, { useState } from 'react';
import {
  message, Space, Input, Button,
} from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { patchPostData } from '../api/API';

// id here refers to the post id assigned by MongoDB
function CommentBox({ commentList, id, loggedInUserID }) {
  const commentListCopy = [...commentList];
  const [comment, setComment] = useState(commentListCopy);

  const sendOnClick = async () => {
    const textInput = document.getElementById(`mainTextInput${id}`).value;
    try {
      const object = {
        userID: loggedInUserID || '',
        text: textInput || '',
      };
      const temp = comment.slice();
      temp.push(object);
      await patchPostData(id, { commentList: temp });
      // Update the state with the modified comment list
      setComment(temp);

      message.success('Comment created');
    } catch (error) {
      message.error('Failed to post');
      message.error(error.message);
    }
  };

  return (
    <Space direction="vertical" align="center">
      <Space className="postComment" direction="vertical" align="center">
        {comment.map((c, index) => (
          // eslint-disable-next-line react/no-array-index-key,react/style-prop-object
          <span style={{ marginBottom: '1px', marginTop: '1px', fontWeight: 'bold' }} key={index}>
            <Link to={`/profile/${c.userID}`}>{`${c.userID}: `}</Link>
            <strong>{c.text}</strong>
          </span>
        ))}
      </Space>
      <Space className="commentInputTop" direction="horizontal" align="center">
        <Input
          placeholder="Add a comment!"
          className="shareInput"
          id={`mainTextInput${id}`}
          style={{ border: '1px solid #ccc' }}
        />
        <Button
          className="commentButton"
          type="button"
          onClick={sendOnClick}
          style={{ border: '1px solid #ccc' }}
        >
          Add
        </Button>
      </Space>
    </Space>
  );
}

CommentBox.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  commentList: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
  loggedInUserID: PropTypes.string.isRequired,
};

export default CommentBox;
