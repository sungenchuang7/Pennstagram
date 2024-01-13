import React from 'react';
import { Button, message } from 'antd';
import PropTypes from 'prop-types';
import { getUserData, patchUserData } from '../api/API';

function FollowUnfollowButton(
  {
    userID,
    loggedInUserID,
    followingState,
    setFollowingState,
    setProfilePageUserFollowers,
  },
) {
  if (userID === loggedInUserID) {
    return (' ');
  }

  const onClickHandler = async () => {
    let res = await getUserData(loggedInUserID);
    // let res = await axios.get(`http://localhost:5001/user?userID=${loggedInUserID}`);
    // console.log('onClickHandler res', res);
    [res] = res.data;
    const ownAvatar = res.avatar || '';
    const ownUserName = res.userName || '';
    const followingList = res.followings || [];
    const jsonIdLoggedInUser = res._id;

    if (followingState === 'Following') {
      // it's following
      // need to unfollow
      setFollowingState('Follow');
      try {
        // console.log('++');
        // first's update logged in user's own following list
        const filtered = followingList.filter((following) => following.userID !== userID);
        // console.log('+++filtered', filtered);
        // await axios.patch(`http://localhost:5001/user/${jsonIdLoggedInUser}`, { followings: filtered });
        await patchUserData(jsonIdLoggedInUser, { followings: filtered });

        // update followed guy's followed list
        // res = await axios.get(`http://localhost:5001/user?userID=${userID}`);
        res = await getUserData(userID);
        [res] = res.data;
        let followedList = res.followers || [];
        const jsonIdUser = res._id;
        followedList = followedList.filter((followed) => followed.userID !== loggedInUserID);
        setProfilePageUserFollowers(followedList);
        // await axios.patch(`http://localhost:5001/user/${jsonIdUser}`, { followers: followedList });
        await patchUserData(jsonIdUser, { followers: followedList });
        message.success('unfollowing');
      } catch (error) {
        message.error('unable to unfollow');
        message.error(error.message);
      }
    } else {
      // need to follow
      // first update my own following list
      setFollowingState('Following');
      try {
        res = await getUserData(userID);
        // res = await axios.get(`http://localhost:5001/user?userID=${userID}`);
        [res] = res.data;
        const avatar = res.avatar || '';
        const userName = res.userName || '';
        const followedList = res.followers || [];
        const jsonIdUser = res._id;
        const concatenated = followingList.concat([{ userID, userName, avatar }]);
        // console.log('--followingList', concatenated);
        // await axios.patch(`http://localhost:5001/user/${jsonIdLoggedInUser}`, { followings: concatenated });
        await patchUserData(jsonIdLoggedInUser, { followings: concatenated });

        // update followed guys followed list
        followedList.push({ userID: loggedInUserID, userName: ownUserName, avatar: ownAvatar });
        setProfilePageUserFollowers(followedList);
        // await axios.patch(`http://localhost:5001/user/${jsonIdUser}`, { followers: followedList });
        await patchUserData(jsonIdUser, { followers: followedList });
        message.success('following');
      } catch (error) {
        message.error('unable to follow');
        message.error(error.message);
      }
    }
  };

  return (<Button id="followUnfollow" block onClick={onClickHandler}>{followingState}</Button>);
}

FollowUnfollowButton.propTypes = {
  userID: PropTypes.string.isRequired,
  loggedInUserID: PropTypes.string.isRequired,
  followingState: PropTypes.string.isRequired,
  setFollowingState: PropTypes.func.isRequired,
  setProfilePageUserFollowers: PropTypes.func.isRequired,
};

export default FollowUnfollowButton;
