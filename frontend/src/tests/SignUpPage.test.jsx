import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  render, waitFor, screen, act,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import userEvent from '@testing-library/user-event';
import SignUp from '../pages/SignUpPage';

test('test whether the website is rendered or not', () => {
  render(
    <MemoryRouter>
      <SignUp />
    </MemoryRouter>,
  );

  // You can add assertions here to check if certain elements are rendered on the SignUp component.
  // For example:
  expect(screen.getByText(/Sign Up/)).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
});

jest.mock('axios'); // Mocking axios for handling HTTP requests
test('test successful registration', async () => {
  // Mock successful axios responses
  axios.get.mockResolvedValueOnce({ data: [] }); // Mock that email is not registered
  axios.post.mockResolvedValueOnce({ data: [] }); // Mock a successful registration

  render(
    <MemoryRouter>
      <SignUp />
    </MemoryRouter>,
  );

  // Simulate user input

  await act(async () => {
    userEvent.type(screen.getByPlaceholderText('Username'), 'testuser');
    userEvent.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    userEvent.type(screen.getByPlaceholderText('Password'), '123');
    userEvent.click(screen.getByText('Sign Up'));
  });

  // Wait for the successful registration message to appear
  await waitFor(() => {
    expect(screen.getByText('Registration succeed.')).toBeInTheDocument();
  });
});

test('test uploadAvatar', async () => {
  // Render the SignUp component
  render(
    <MemoryRouter>
      <SignUp />
    </MemoryRouter>,
  );
  // Get the file input element for avatar upload
  // Adjust this query to match the specifics of your `AvatarUploader`
  const fileInput = screen.getByLabelText('avatar-upload');

  // Create a fake "illegal" file. Let's assume a '.txt' file is illegal for avatar upload.
  const illegalFile = new File(['Hello World'], 'sample.txt', { type: 'text/plain' });

  // Use userEvent to simulate the file upload
  // userEvent.upload(fileInput, illegalFile);
  await act(async () => {
    // Use userEvent to simulate the file upload
    userEvent.upload(fileInput, illegalFile);
  });

  // eslint-disable-next-line max-len
  // Check the expected behavior. Assuming an error message appears when an illegal file is selected:
  expect(screen.getByText('You can only upload JPG or PNG file!')).toBeInTheDocument();
});
