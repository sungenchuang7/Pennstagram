import React, { useState } from 'react';
import {
  Button, Input, message, Space,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import bannerImage from './resources/university-of-pennsylvania-logo.png';
import upennCampus from './resources/upennCampus.png';
import './SignUpPage.css';
import AvatarUploader from '../components/AvatarUploader.jsx';
import { createNewUser } from '../api/API.jsx';

function SignUp() {
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  const signUpOnClick = async () => {
    const usernamestr = document.getElementById('username').value;
    const emailstr = document.getElementById('emailBox').value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordstr = document.getElementById('passwordBox').value;

    if ((usernamestr.length !== 0) && (emailPattern.test(emailstr)) && (passwordstr.length !== 0)) {
      // console.log('SignUpPage signUpOnClick before getUserData');
      // let res = await getUserData(emailstr); this should be done by the backend
      // console.log('SignUpPage signUpOnClick after getUserData');
      // let res = await axios.get(`http://localhost:5001/user?userID=${emailstr}`);
      // [res] = res.data;
      // if (res !== undefined) {
      //   // check whether the email has been registered or not.
      //   message.error('Email registered.');
      //   return;
      // }
      try {
        const user = { // do we need to worry about the unsuccessful situation.
          userID: emailstr,
          userName: usernamestr,
          password: passwordstr,
          avatar: imageUrl,
          followers: [],
          followings: [],
          logInAttempts: { lastTime: 0, count: 0 },
        };
        await createNewUser(user);
        // await axios.post('http://localhost:5001/user', user);
        message.success('Registration succeed.');
        setImageUrl('');
        navigate('/login');
      } catch (error) {
        message.error(error.message);
        message.error('Registration failed');
        message.error(error.response.data.message);
      }
    } else {
      message.error('Illegal Input.');
    }
  };

  const inputInfo = () => (
    <Space direction="vertical">
      <h2 id="headline">Pennstagram</h2>
      <h2 id="registerTxt">Register</h2>
      <AvatarUploader imageUrl={imageUrl} setImageUrl={setImageUrl} />
      <Input id="username" placeholder="Username" />
      <Input id="emailBox" placeholder="Email" />
      <Input.Password id="passwordBox" placeholder="Password" />
      <Button id="signUp" block onClick={signUpOnClick}>Sign Up</Button>
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

export default SignUp;
