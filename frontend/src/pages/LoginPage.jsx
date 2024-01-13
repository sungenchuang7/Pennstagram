import React, { useEffect } from 'react';
import {
  Button, Input, message, Space,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import bannerImage from './resources/university-of-pennsylvania-logo.png';
import upennCampus from './resources/upennCampus.png';
import './LoginPage.css';
import { loginAPI } from '../api/API';

function LogIn() {
  const navigate = useNavigate(); // initialize useNavigate
  useEffect(() => {
    localStorage.setItem('userID', '');
  }, []);

  const registrationBtnOnClick = () => {
    // implement later
    navigate('/signup'); // navigate to /signup when button is clicked
  };

  const loginOnClick = async () => {
    try {
      const emailBox = document.getElementById('emailBox').value;
      const passwordBox = document.getElementById('passwordBox').value;
      // console.log('emailBox', emailBox);
      // console.log('passwordBox', passwordBox);
      const response = await loginAPI(emailBox, passwordBox);
      // const response = await axios.get(`http://localhost:5001/user?userID=${emailBox}`);
      // console.log('loginOnClick response', response);
      const { apptoken } = response.data;
      console.log('loginOnClick, response', response);
      console.log('loginOnClick, apptoken', apptoken);
      if (apptoken) {
        message.success('login success');
        localStorage.setItem('app-token', apptoken);
        // setUser(emailBox);
        localStorage.setItem('userID', emailBox);
        navigate('/home');
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      message.error(error.message);
      message.error(error.response && error.response.data && error.response.data.error);
    }
  };

  const inputInfo = () => (
    <Space direction="vertical">
      <h1 id="headline">Pennstagram</h1>
      <h2 id="welcomeMessage">Welcome</h2>
      <Input id="emailBox" placeholder="Email" />
      <Input.Password id="passwordBox" placeholder="Password" />
      <Button id="logInBtn" block onClick={loginOnClick}>Log In</Button>
      <Button id="registrationBtn" block onClick={registrationBtnOnClick}>Register</Button>
    </Space>
  );

  return (
    <div>
      <div className="bannerArea">
        <img id="bannerImage" src={bannerImage} alt="UPenn Banner" />
      </div>
      <div className="mainView">
        <Space id="inputWithImage" direction="horizontal" align="center">
          {inputInfo()}
          <img id="upennCampusImg" src={upennCampus} alt="UPenn Campus" />
        </Space>
      </div>
    </div>
  );
}
export default LogIn;
