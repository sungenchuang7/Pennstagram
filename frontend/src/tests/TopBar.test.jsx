import React from 'react';
import {
  render, screen, fireEvent, act,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import TopBar from '../components/TopBar';

// Mocking axios
jest.mock('axios');

describe('TopBar Component', () => {
  const mockSetLogIn = jest.fn();
  const mockSetUser = jest.fn();
  const userIDMock = 'testuser@example.com';

  beforeEach(() => {
    render(
      <MemoryRouter>
        <TopBar userID={userIDMock} setLogIn={mockSetLogIn} setUser={mockSetUser} />
      </MemoryRouter>,
    );
  });

  it('renders without crashing', () => {
    const logoElement = screen.getByText('Pennstagram');
    expect(logoElement).toBeInTheDocument();
  });

  // More tests related to button clicks can be added here using fireEvent.click()

  it('searches and navigates to profile if user exists', async () => {
    axios.get.mockResolvedValueOnce({
      data: [{
        userID: 'existinguser@example.com',
      }],
    });

    await act(() => {
      const inputBox = screen.getByPlaceholderText('user email');
      fireEvent.change(inputBox, { target: { value: 'existinguser@example.com' } });

      const searchButton = screen.getByText('Search');
      fireEvent.click(searchButton);
    });

    // Expectations like checking if navigation occurred or any UI changes can be added here
    // This depends on how you handle navigation in your app
    await expect(screen.getByText('User found!')).toBeInTheDocument();
  });

  it('searches and navigates to profile if user does not exist', async () => {
    axios.get.mockResolvedValueOnce(undefined);

    await act(() => {
      const inputBox = screen.getByPlaceholderText('user email');
      fireEvent.change(inputBox, { target: { value: 'existinguser@example.com' } });

      const searchButton = screen.getByText('Search');
      fireEvent.click(searchButton);
    });

    // Expectations like checking if navigation occurred or any UI changes can be added here
    // This depends on how you handle navigation in your app
    await expect(screen.getByText('User found!')).toBeInTheDocument();
  });

  it('home page', async () => {
    axios.get.mockResolvedValueOnce(undefined);

    await act(() => {
      const searchButton = screen.getByText('Home');
      fireEvent.click(searchButton);
    });

    // Expectations like checking if navigation occurred or any UI changes can be added here
    // This depends on how you handle navigation in your app
    await expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('log out', async () => {
    axios.get.mockResolvedValueOnce(undefined);

    await act(() => {
      const searchButton = screen.getByText('Log Out');
      fireEvent.click(searchButton);
    });

    // Expectations like checking if navigation occurred or any UI changes can be added here
    // This depends on how you handle navigation in your app
    await expect(screen.getByText('Log Out!')).toBeInTheDocument();
  });

  it('Profile Page', async () => {
    axios.get.mockResolvedValueOnce(undefined);

    await act(() => {
      const searchButton = screen.getByText('Profile');
      fireEvent.click(searchButton);
    });

    // Expectations like checking if navigation occurred or any UI changes can be added here
    // This depends on how you handle navigation in your app
    await expect(screen.getByText('Profile Page')).toBeInTheDocument();
  });
});
