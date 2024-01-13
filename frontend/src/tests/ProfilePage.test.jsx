import {
  act, render, waitFor, screen,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import ProfilePage from '../pages/ProfilePage';
import '@testing-library/jest-dom/extend-expect';

window.matchMedia = window.matchMedia || function () {
  return {
    matches: false,
    addListener() {},
    removeListener() {},
  };
};

jest.mock('axios'); // Mocking axios for handling HTTP requests

beforeAll(() => {
  localStorage.setItem('userID', 'yzlsps@qq.com');
});

test('general test for ProfilePage 1', async () => {
  const logIn = true;
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/emily@upenn.edu']}>
        <ProfilePage setLogIn={jest.fn()} logIn={logIn} setUser={jest.fn()} user="yzlsps@qq.com" />
      </MemoryRouter>,
    );
  });

  await waitFor(() => {
    expect(screen.getByText(/Username:/i)).toBeInTheDocument();
  });
});

test('general test for ProfilePage 2', async () => {
  const profilePageUser = {
    data: [{
      userID: 'emily@upenn.edu',
      userName: 'Emily',
      password: '123',
    }],
  };

  axios.get.mockResolvedValueOnce(profilePageUser);

  const loggedInUser = {
    data: [{
      userID: 'yzlsps@qq.com',
      userName: 'YZL',
      password: '123',
    }],
  };

  axios.get.mockResolvedValueOnce(loggedInUser);

  const postObject = {
    data: {
      totalLength: 2,
      posts: [{
        userName: 'Emily',
        userID: 'emily@upenn.edu',
        url: 'https://www.youtube.com/embed/Pl7VRRIs5Uo?si=wt44vXvKgquy1eZM',
        text: 'My first post',
        time: '2023-10-17',
        _id: '1',
      },
      {
        userName: 'Emily',
        userID: 'emily@upenn.edu',
        url: 'https://www.youtube.com/embed/Pl7VRRIs5Uo?si=wt44vXvKgquy1eZM',
        text: 'My second post',
        time: '2023-10-16',
        _id: '2',
      }],
    },
  };
  axios.get.mockResolvedValueOnce(postObject);

  const logIn = true;
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/profile/emily@upenn.edu']}>
        <ProfilePage setLogIn={jest.fn()} logIn={logIn} setUser={jest.fn()} user="yzlsps@qq.com" />
      </MemoryRouter>,
    );
  });

  await waitFor(() => {
    expect(screen.getByText('My first post')).toBeInTheDocument();
  });
});
