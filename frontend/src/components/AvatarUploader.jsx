import React, { useState } from 'react';
import { message, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

function AvatarUploader({ imageUrl, setImageUrl }) {
  // this is a modified component to upload user avatar from ant-design
  const [loading, setLoading] = useState(false);

  const beforeUpload = (file) => {
    const defined = (file !== undefined);

    const type1 = (file.type === 'image/jpeg');
    const type2 = (file.type === 'image/png');
    const isJpgOrPng = type1 || type2;
    const condition1 = !isJpgOrPng;
    if (condition1) {
      const errorMessage = 'You can only upload JPG or PNG file!';
      message.error(errorMessage);
      message.error('Please upload again!');
    }
    let { size } = file;
    size /= 1024;
    size /= 1024;
    const isLt2M = size < 1;
    const condition2 = !isLt2M;
    if (condition2) {
      message.error('Image must be smaller than 1MB!');
    }
    const finalCondition = (isJpgOrPng && isLt2M && defined);
    return finalCondition;
  };

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setLoading(false);
        setImageUrl(reader.result);
      });
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  return (
    <Upload
      name="avatar"
      listType="picture-circle"
      className="avatar-uploader"
      showUploadList={false}
      action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
      beforeUpload={beforeUpload}
      onChange={handleChange}
      aria-label="avatar-upload"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="avatar"
          style={{
            width: '100%',
          }}
        />
      ) : (
        uploadButton
      )}
    </Upload>
  );
}

AvatarUploader.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  setImageUrl: PropTypes.func.isRequired,
};

export default AvatarUploader;
