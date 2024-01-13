import React, { useEffect, useRef, useState } from 'react';
import './ProfilePage.css';
import {
  message,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import Topbar from '../components/TopBar';
import Profile from '../components/Profile';
import Feed from '../components/Feed';
import { getUserData, getProfilepagePost } from '../api/API';

function ProfilePage() {
  const navigate = useNavigate();
  // this part of code will make sure that user can only view the content after they log in.

  useEffect(() => {
    // if user does not log in, redirect to the login page.
    if (localStorage.getItem('app-token') === null) {
      message.error('First Log In');
      navigate('/login');
    }
  }, []);

  // this userID is profile page's user's userID
  // this userID is different from ProfilePage's props.user
  // props.user is logged user's ID.
  let { userID } = useParams();
  if (userID === undefined) {
    userID = 'emily@upenn.edu';
  }

  // this state is used to store profile user's data (not include post)
  const [userData, setUserData] = useState(null);
  // this state stores whether the logged-in user follows the profile's page's user
  const [followingState, setFollowingState] = useState('');
  const [profilePageUserFollowers, setProfilePageUserFollowers] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const totalLength = useRef(0);
  const postCount = useRef(2);
  const user = localStorage.getItem('userID');

  // this fetchData is for initial data retrieval and periodic update.
  const fetchData = async () => {
    try {
      // get profile page user's data first
      const response = await getUserData(userID);
      // const response = await axios.get(`http://localhost:5001/user?userID=${userID}`);
      const userDataTemp = response.data[0];
      setUserData(userDataTemp);
      setProfilePageUserFollowers(userDataTemp.followers || []);

      // check whether the user is following the current user
      let res = await getUserData(user);
      // let res = await axios.get(`http://localhost:5001/user?userID=${user}`);
      [res] = res.data;
      const followingList = res.followings || [];
      if (followingList.some((obj) => obj.userID === userID)) {
        setFollowingState('Following');
        // console.log("setFollowingState('Following');");
      } else {
        // console.log("setFollowingState('Follow');");
        setFollowingState('Follow');
      }

      const res2 = await getProfilepagePost(userID, postCount.current);
      totalLength.current = res2.data.totalLength;
      const activityfeed = res2.data.posts;
      setActivityFeed(activityfeed);
    } catch (error) {
      message.error('Unable to fetch user data.');
    }
  };

  // this fetchData is for infinite scrolling.
  const fetchData2 = async () => {
    try {
      const res2 = await getProfilepagePost(userID, postCount.current);
      postCount.current += 2;
      const activityfeed = res2.data.posts;
      totalLength.current = res2.data.totalLength;
      setActivityFeed(activityfeed);
    } catch (error) {
      message.error('Unable to fetch user data.');
    }
  };

  useEffect(() => {
    fetchData();
    const intervalID = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalID);
  }, [userID]);
  return (
    <div>
      <Topbar />
      <div>
        <Profile
          profilePageUserFollowers={profilePageUserFollowers}
          setProfilePageUserFollowers={setProfilePageUserFollowers}
          followingState={followingState}
          following={(userData && userData.followings) || []}
          setFollowingState={setFollowingState}
          avatar={(userData && userData.avatar) || ''}
          userName={(userData && userData.userName) || ''}
          userID={userID}
          user={user}
        />
        <div style={{
          display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: '40px',
        }}
        >
          <Feed
            posts={activityFeed}
            setPosts={setActivityFeed}
            loggedInUserID={user}
            count={postCount}
            fetchData={fetchData2}
            totalLength={totalLength}
          />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
