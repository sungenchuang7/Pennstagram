import React, { useState } from 'react';
import {
  Button, message, Popover, Space,
} from 'antd';
import PropTypes from 'prop-types';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import VideocamIcon from '@mui/icons-material/Videocam';
import { deleteFile, patchPostData, uploadFile } from '../api/API';

function EditPostButton({
  activityFeed, setActivityFeed, id, fileName,
}) {
  const activityFeedCopy = [...activityFeed];
  const [post] = activityFeedCopy.filter((element) => element._id === id);
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState(undefined);

  const content = () => {
    const submitBtn = async () => {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      const textInput = document.getElementById(`maintTextInput${id}`).value;
      let s3url = post.url;
      let newFileName = fileName;
      let object;

      try {
        // delete file first if there is a file
        if (fileName !== '') {
          await deleteFile(fileName);
        }
        if (files) {
          // upload new file
          const formData = new FormData();
          const timestamp = currentDate.getTime(); // Get the timestamp
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
          message.info('Uploading file');
          s3url = await uploadFile(formData);
        }
        object = {
          url: s3url || post.url,
          text: textInput || post.text,
          time: formattedDate,
          fileName: newFileName || post.fileName,
        };
        await patchPostData(id, object);
      } catch (e) {
        message.error(`Unable to modify the post, error: ${e.message}`);
      }
      const newActivityFeed = activityFeedCopy.filter((element) => element._id !== id);
      post.url = object.url;
      post.text = object.text;
      post.time = object.time;
      post.fileName = object.fileName;
      newActivityFeed.unshift(post);
      setActivityFeed(newActivityFeed);
      setOpen(false);
      message.success('Edited!');

      document.getElementById(`maintTextInput${id}`).value = '';
    };

    const clsBtnOnClick = () => {
      setOpen(false);
    };

    const updateFile = (evt) => {
      if (evt.target.files.length > 1) {
        message.error('One file allowed');
        return;
      }
      setFiles([...evt.target.files]);
    };

    return (
      <div>
        <form>
          <div className="shareWrapper">
            <Space className="shareTop" direction="vertical">
              <input placeholder="Share your thoughts..." className="shareInput" id={`maintTextInput${id}`} />
            </Space>
            <hr className="shareHr" />

            <div className="shareBottom">
              <div className="shareOptions">
                <div className="shareOption">
                  <AddAPhotoIcon className="shareIcon" style={{ color: '#7FB3D5', cursor: 'pointer' }} />
                  <VideocamIcon className="shareIcon" style={{ color: '#7FB3D5' }} />
                  <input id={`upload${id}`} data-testid="submitBtn" className="shareInput" type="file" onChange={(e) => updateFile(e)} />
                </div>
              </div>
              <Button id={`submitBtn${id}`} onClick={submitBtn}>Submit</Button>
              <Button id="clsBtn" onClick={clsBtnOnClick}>Close</Button>
            </div>
          </div>
        </form>
      </div>
    );
  };

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  return (
    <Popover
      content={content}
      title="Title"
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Button type="primary">Edit</Button>
    </Popover>
  );
}

EditPostButton.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  activityFeed: PropTypes.array.isRequired,
  setActivityFeed: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
};

export default EditPostButton;
