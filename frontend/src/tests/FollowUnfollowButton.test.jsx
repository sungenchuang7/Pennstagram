import React from 'react';
import axios from 'axios';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import FollowUnfollowButton from '../components/FollowUnfollowButton';

jest.mock('axios');

beforeEach(() => {
  // Reset all mock data before each test
  axios.patch.mockReset();
});

test('test unfollow', async () => {
  const user = {
    data: [{
      userID: 'emily@upenn.edu',
      userName: 'Emily',
      password: '123',
      id: 1,
    }],
  };
  axios.get.mockResolvedValueOnce(user);
  axios.get.mockResolvedValueOnce(user);

  const mockResponse = { data: 'success' };
  axios.patch.mockResolvedValueOnce(mockResponse);
  axios.patch.mockResolvedValueOnce(mockResponse);

  const userID = 'yzlsps@qq.com';
  const loggedInUserID = 'emily@upenn.edu';
  const followingState = 'Follow';
  const setFollowingState = () => {};
  const setProfilePageUserFollowers = () => {};

  render(
    <FollowUnfollowButton
      setProfilePageUserFollowers={setProfilePageUserFollowers}
      followingState={followingState}
      setFollowingState={setFollowingState}
      loggedInUserID={loggedInUserID}
      userID={userID}
    />,
  );

  await act(() => {
    userEvent.click(screen.getByText('Follow'));
  });

  await expect(screen.getByText('following')).toBeInTheDocument();
});

test('test follow', async () => {
  const user = {
    data: [{
      userID: 'emily@upenn.edu',
      userName: 'Emily',
      password: '123',
      id: 1,
    }],
  };
  axios.get.mockResolvedValueOnce(user);

  const mockResponse = { data: 'success' };
  axios.patch.mockResolvedValueOnce(mockResponse);
  axios.get.mockResolvedValueOnce(user);
  axios.patch.mockResolvedValueOnce(mockResponse);

  const userID = 'yzlsps@qq.com';
  const loggedInUserID = 'emily@upenn.edu';
  const followingState = 'Following';
  const setFollowingState = () => {};
  const setProfilePageUserFollowers = () => {};

  render(
    <FollowUnfollowButton
      userID={userID}
      setProfilePageUserFollowers={setProfilePageUserFollowers}
      followingState={followingState}
      setFollowingState={setFollowingState}
      loggedInUserID={loggedInUserID}
    />,
  );

  await act(() => {
    userEvent.click(screen.getByText('Following'));
  });

  await expect(screen.getByText('unfollowing')).toBeInTheDocument();
});
