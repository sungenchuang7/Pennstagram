import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  render, waitFor, screen, act,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import userEvent from '@testing-library/user-event';
import LogIn from '../pages/LoginPage';

test('test whether the website is rendered or not', () => {
  const logIn = false;
  const setLogIn = () => {};
  const user = '';
  const setUser = () => {};

  const { getByText } = render(
    <MemoryRouter>
      <LogIn
        logIn={logIn}
        setLogIn={setLogIn}
        user={user}
        setUser={setUser}
      />
    </MemoryRouter>,
  );
  const logInElement = getByText(/Log In/);
  expect(logInElement).toBeInTheDocument();
});

jest.mock('axios'); // Mocking axios for handling HTTP requests
test('test click log in', async () => {
  // Mock successful axios response
  axios.post.mockResolvedValueOnce({
    data: {
      apptoken: 'a',
    },
  });

  render(
    <MemoryRouter>
      <LogIn logIn={false} setLogIn={jest.fn()} user="" setUser={jest.fn()} />
    </MemoryRouter>,
  );

  await act(async () => {
    // Simulate user entering "a" into email and password boxes
    userEvent.type(screen.getByPlaceholderText('Email'), 'a');
    userEvent.type(screen.getByPlaceholderText('Password'), 'a');

    // Click the login button
    userEvent.click(screen.getByText('Log In'));
  });

  // Wait for the mocked axios call and expect the login success message to be in the document
  await waitFor(() => {
    expect(screen.getByText('login success')).toBeInTheDocument();
  });
});
