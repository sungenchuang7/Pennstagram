import './Share.css';
import React, { useState } from 'react';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { message, Space } from 'antd';
import PropTypes from 'prop-types';
import VideocamIcon from '@mui/icons-material/Videocam';
import { uploadFile, newPosts } from '../api/API';

function Share({ userData, activityFeed, setActivityFeed }) {
  const [files, setFiles] = useState(undefined);

  const updateFile = (evt) => {
    if (evt.target.files.length > 1) {
      message.error('One file allowed');
      return;
    }
    setFiles([...evt.target.files]);
  };

  // event handler for files upload

  const sendOnClick = async () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const textInput = document.getElementById('maintTextInput').value;
    let s3url = '';
    let newFileName = '';
    try {
      if (files) {
        message.info('Uploading file');
        // upload file
        const formData = new FormData();
        const timestamp = currentDate.getTime(); // Get the timestamp
        // Add files to the formdata object
        // "multiple" prop to the input element
        if (!/\.(jpeg|jpg|png|gif|mp4|webm|ogg)$/i.test(files[0].name)) {
          message.error('Invalid file, only media file');
          return;
        }

        if (files[0].size > 500 * 1048576) {
          message.error('The file size should be within 500 MB');
          return;
        }

        for (let i = 0; i < files.length; i += 1) {
          newFileName = `${timestamp}_${files[0].name}`; // Use the timestamp to ensure uniqueness
          formData.append(`File_${i}`, files[i], newFileName);
        }
        // upload the file
        s3url = await uploadFile(formData);
      }
      const object = {
        avatar: userData.avatar || '',
        userName: userData.userName || '',
        userID: userData.userID || '',
        url: s3url,
        fileName: newFileName,
        text: textInput,
        time: formattedDate,
      };

      // await axios.post('http://localhost:5001/posts', object);
      const response = await newPosts(object);
      object._id = response.data.id;
      const newActivityFeed = [...activityFeed, object].sort((a, b) => {
        const dateA = new Date(a.time);
        const dateB = new Date(b.time);

        if (dateA < dateB) return 1;
        if (dateA > dateB) return -1;
        return 0;
      });
      setActivityFeed(newActivityFeed);
      message.success('Post created');
      setFiles(undefined);
      document.getElementById('maintTextInput').value = '';
    } catch (error) {
      message.error('Failed to post');
      message.error(error.message);
    }
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <Space className="shareTop" direction="vertical">
          <input placeholder="Share your thoughts..." className="shareInput" id="maintTextInput" />
        </Space>
        <hr className="shareHr" />

        <div className="shareBottom">
          <div className="shareOption">
            <AddAPhotoIcon className="shareIcon" style={{ color: '#7FB3D5', cursor: 'pointer' }} />
            <VideocamIcon className="shareIcon" style={{ color: '#7FB3D5' }} />
            <input id="upload" className="shareInput" type="file" onChange={(e) => updateFile(e)} />
          </div>
          <button className="shareButton" type="button" onClick={sendOnClick}>Post</button>
        </div>
      </div>
    </div>
  );
}

Share.propTypes = {
  userData: PropTypes.shape({
    avatar: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    userID: PropTypes.string.isRequired,
  }).isRequired,
  // I get TA's permit to disable this rule
  // eslint-disable-next-line react/forbid-prop-types
  activityFeed: PropTypes.array.isRequired,
  setActivityFeed: PropTypes.func.isRequired,
};

export default Share;
