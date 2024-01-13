import {
  Avatar, Button, List, Popover, Space,
} from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FollowUnfollowButton from './FollowUnfollowButton.jsx';

function Profile({
  profilePageUserFollowers,
  setProfilePageUserFollowers,
  following, userID, userName,
  avatar,
  user,
  followingState,
  setFollowingState,
}) {
  const followerContent = () => (
    <List
      itemLayout="horizontal"
      id="followerList"
      size="small"
      dataSource={profilePageUserFollowers}
      /* eslint-disable-next-line no-shadow */
      renderItem={(follower) => (
        <List.Item>
          <List.Item.Meta
            avatar={(
              <Link to={`/profile/${follower.userID}`}>
                <Avatar src={follower.avatar} />
              </Link>
            )}
            // avatar={<Avatar src={follower.avatar} />}
            title={follower.userName}
          />
        </List.Item>
      )}
    />
  );

  const followingContent = () => (
    <List
      itemLayout="horizontal"
      id="followingList"
      size="small"
      dataSource={following}
      /* eslint-disable-next-line no-shadow */
      renderItem={(following) => (
        <List.Item>
          <List.Item.Meta
            avatar={(
              <Link to={`/profile/${following.userID}`}>
                <Avatar src={following.avatar} />
              </Link>
            )}
            // avatar={<Avatar src={following.avatar} />}
            title={following.userName}
          />
        </List.Item>
      )}
    />
  );

  return (
    <div style={{
      display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: '40px',
    }}
    >
      <Space id="detailInfo" direction="horizontal">
        <Avatar id="userAvatar" src={avatar} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2>User Profile</h2>
          <h4 id="profileUsername">
            Username:
            &nbsp;
            {userName}
          </h4>
          <h4 id="profileUserId">
            User ID: &nbsp;
            {userID}
          </h4>
          <FollowUnfollowButton
            userID={userID}
            loggedInUserID={user}
            followingState={followingState}
            setFollowingState={setFollowingState}
            setProfilePageUserFollowers={setProfilePageUserFollowers}
          />
          <Space direction="horizontal">
            <Popover id="followingPopover" placement="bottom" title={`${(following ? following.length : 0)} Followings`} content={followingContent()}>
              <Button id="followingBtn">Following</Button>
            </Popover>
            <Popover
              id="followerPopover"
              placement="bottom"
              title={`${(profilePageUserFollowers ? profilePageUserFollowers.length : 0)} Followers`}
              content={followerContent()}
            >
              <Button id="followerBtn">Followers</Button>
            </Popover>
          </Space>
        </div>
      </Space>
    </div>
  );
}

Profile.propTypes = {
  // I get TA's permit to disable this rule
  // eslint-disable-next-line react/forbid-prop-types
  profilePageUserFollowers: PropTypes.array.isRequired,
  setProfilePageUserFollowers: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  following: PropTypes.array.isRequired,
  userID: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  followingState: PropTypes.string.isRequired,
  setFollowingState: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
};

export default Profile;
