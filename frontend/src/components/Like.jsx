import React, { useEffect, useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import { message } from 'antd';
import PropTypes from 'prop-types';
import { patchPostData } from '../api/API.jsx';

// id here refers to the post id assigned by MongoDB
function Like({ likeList, id, loggedInUserID }) {
  let likeListCopy = [...likeList];
  const [like, setLike] = useState(false);

  useEffect(() => {
    // console.log(`loggedInUserID: ${loggedInUserID}`);
    // console.log(`likeList: ${likeListCopy} ${typeof likeListCopy}`);
    if (likeListCopy.includes(loggedInUserID)) {
      // console.log('set true');
      setLike(true);
    }
  }, [loggedInUserID]);

  const handleClick = async () => {
    let temp;
    if (like) {
      // unlike the post
      try {
        temp = likeListCopy.filter((ele) => ele !== loggedInUserID);
        const result = await patchPostData(id, { like: temp });
        if (result.status === 400) {
          throw new Error();
        }
      } catch (e) {
        message.error('Unable to unlike the post');
      }
      setLike(false);
    } else {
      // like the post
      try {
        temp = [...likeList];
        temp.push(loggedInUserID);
        const result = await patchPostData(id, { like: temp });
        if (result.status === 400) {
          throw new Error();
        }
      } catch (e) {
        message.error('Unable to like the post');
      }
      setLike(true);
    }
    likeListCopy = temp;
  };

  return (
    <IconButton onClick={handleClick}>
      <FavoriteIcon data-testid="FavoriteIcon" sx={{ color: like ? 'red' : 'grey' }} />
    </IconButton>
  );
}

Like.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  likeList: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
  loggedInUserID: PropTypes.string.isRequired,
};

export default Like;
