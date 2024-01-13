import React from 'react';
import {
  render, fireEvent, waitFor, screen, getByTestId,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { patchPostData } from '../api/API'; // Adjust the import path as necessary
import Like from '../components/Like';

// Mock the API call
jest.mock('../api/API', () => ({
  patchPostData: jest.fn(),
}));

describe('Like Component', () => {
  const mockId = '123';
  const mockLoggedInUserID = 'user1';

  it('should render like button', () => {
    render(<Like likeList={[]} id={mockId} loggedInUserID={mockLoggedInUserID} />);
    const likeButton = screen.getByRole('button');
    expect(likeButton).toBeInTheDocument();
  });

  it('should show an error message if the like action fails', async () => {
    patchPostData.mockRejectedValueOnce(new Error());

    render(<Like likeList={[]} id={mockId} loggedInUserID={mockLoggedInUserID} />);
    const likeButton = screen.getByRole('button');

    // Wrap the state-changing action in act()
    await act(async () => {
      fireEvent.click(likeButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Unable to like the post')).toBeInTheDocument();
    });
  });

  it('should show an error message if the unlike action fails', async () => {
    patchPostData.mockRejectedValueOnce(new Error());

    render(<Like
      likeList={[mockLoggedInUserID]}
      id={mockId}
      loggedInUserID={mockLoggedInUserID}
    />);
    const likeButton = screen.getByRole('button');

    // Wrap the state-changing action in act()
    await act(async () => {
      fireEvent.click(likeButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Unable to unlike the post')).toBeInTheDocument();
    });
  });
});
