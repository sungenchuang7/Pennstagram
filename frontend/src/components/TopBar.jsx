import './TopBar.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, message } from 'antd';
import bannerImage from '../pages/resources/university-of-pennsylvania-logo.png';
import { getUserData } from '../api/API.jsx';

function TopBar() {
  const userID = localStorage.getItem('userID');

  const navigate = useNavigate();

  const profileOnClick = async () => {
    // navigate to profile page
    message.success('Profile Page');
    navigate(`/profile/${userID}`);
  };

  const homeOnClick = async () => {
    message.success('Home Page');
    navigate('/home');
  };

  const logOutOnClick = async () => {
    localStorage.removeItem('app-token');
    // setUser('');
    localStorage.removeItem('userID');
    message.success('Log Out!');
    navigate('/login');
  };

  const searchButtonOnClick = async () => {
    const { value } = document.getElementById('inputBox');
    try {
      // const url = `http://localhost:5001/user?userID=${value}`;
      // const response = await axios.get(url);
      const response = await getUserData(value);
      const [res] = response.data;
      if (res !== undefined) {
        message.success('User found!');
        navigate(`/profile/${value}`);
      } else {
        message.error('User does not exist, please input valid email.');
      }
    } catch (error) {
      message.error('Search failed');
    }
  };

  return (
    <div className="topbar">
      <img id="banner" src={bannerImage} alt="UpennLogo" />
      <div className="logo">Pennstagram</div>
      <ul className="nav-links">
        <li>
          <Button className="nav-link" onClick={homeOnClick}>
            Home
          </Button>
        </li>
        <li>
          <Button className="nav-link" onClick={profileOnClick}>
            Profile
          </Button>
        </li>
        <li>
          <Button className="nav-link" onClick={logOutOnClick}>
            Log Out
          </Button>
        </li>
      </ul>
      <div className="search-bar">
        <Input id="inputBox" type="text" placeholder="user email" />
        <Button block onClick={searchButtonOnClick} style={{ height: '100%' }}>Search</Button>
      </div>
    </div>
  );
}

export default TopBar;
