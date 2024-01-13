import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, message, Space } from 'antd';
import Topbar from '../components/TopBar.jsx';
// eslint-disable-next-line import/no-named-as-default,import/no-named-as-default-member
import Feed from '../components/Feed.jsx';
import './HomePage.css';
import Share from '../components/Share.jsx';
import {
  getHomepagePost, getPost, getUserData, patchUserData,
} from '../api/API.jsx';

function HomePage() {
  const [userData, setUserData] = useState(null);
  // const [following, setFollowing] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const postCount = useRef(2);
  const totalLength = useRef(0);
  const navigate = useNavigate();
  const user = localStorage.getItem('userID');

  useEffect(() => {
    // if user does not log in, redirect to the login page.
    if (localStorage.getItem('app-token') === null) {
      message.error('First Log In');
      navigate('/login');
    }
  }, []);

  // this fetchData is for initial data retrieval and periodic update.
  const fetchData = async () => {
    try {
      // get all user's following account
      const firstResponse = await getUserData(user);
      const userdata = firstResponse.data[0];
      setUserData(userdata);

      // get homepage's post
      const res = await getHomepagePost(user, postCount.current);
      const activityfeed = res.data.posts;
      totalLength.current = res.data.totalLength;
      setActivityFeed(activityfeed);
    } catch (error) {
      message.error('unable to fetch data');
      message.error(error.message);
    }
  };

  // this fetchData is for infinite scrolling.
  const fetchData2 = async () => {
    try {
      // get homepage's post
      const res = await getHomepagePost(user, postCount.current);
      postCount.current += 2;
      const activityfeed = res.data.posts;
      totalLength.current = res.data.totalLength;
      setActivityFeed(activityfeed);
    } catch (error) {
      message.error('unable to fetch data');
      message.error(error.message);
    }
  };

  useEffect(() => {
    fetchData();

    const intervalID = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalID);
  }, []);

  const unhidePostOnClick = async () => {
    try {
      // getUserData returns a HTML response
      let res = await getUserData(user);
      // destructure the user Object in the response
      [res] = res.data;
      // get the list of postID (as strings) the user wants to hide
      const postsUserHasHidden = res.hiddenPosts || [];
      // use postID strings to get hiddenPost JSON Objects and store them in an array
      // const hiddenPostsJSONArray = postsUserHasHidden.reduce(async (postID) => {
      //   await getPost(postID)[0];
      // }, []);
      const hiddenPosts = postsUserHasHidden.map((postID) => getPost(postID));
      let resolvedHiddenPosts = await Promise.all(hiddenPosts);
      resolvedHiddenPosts = resolvedHiddenPosts.map((item) => item.data[0]);
      // numberOfHiddenPosts = postsToHide.length;
      const jsonIdUser = res._id;
      await patchUserData(jsonIdUser, { hiddenPosts: [] });
      const newPost = activityFeed.concat(resolvedHiddenPosts);
      setActivityFeed(newPost); // This will update posts array and trigger re-rendering of the feed
      message.success('Post is successfully unhidden!');
    } catch (e) {
      message.error(`Unable to unhide the post, error: ${e.message}`);
    }
  };

  return (
    <div className="home-page">
      <Topbar />
      {'  '}
      {'  '}
      <Space id="mainView" direction="vertical" align="center">
        <Share
          userData={userData || { avatar: '', userName: '', userID: '' }}
          activityFeed={activityFeed || []}
          setActivityFeed={setActivityFeed}
        />
        <div />
        <Button id="unhideButton" onClick={unhidePostOnClick}>
          Unhide posts
        </Button>
        <Feed
          posts={activityFeed || []}
          setPosts={setActivityFeed}
          loggedInUserID={user}
          count={postCount}
          fetchData={fetchData2}
          totalLength={totalLength}
        />
      </Space>
    </div>
  );
}

export default HomePage;
