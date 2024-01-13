import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Feed from '../components/Feed';

describe('Feed Component', () => {
  const mockFetchData = jest.fn();
  const mockSetPosts = jest.fn();
  const mockPosts = [
    { _id: '1', text: 'Post 1' /* other post properties */ },
    { _id: '2', text: 'Post 2' /* other post properties */ },
    // Add more mock posts as needed
  ];
  const mockLoggedInUserID = 'user123';
  const mockCount = { current: 2 };
  const mockTotalLength = { current: 5 };

  it('displays no posts message when there are no posts', () => {
    const { getByText } = render(
      <Feed
        posts={[]}
        setPosts={mockSetPosts}
        loggedInUserID={mockLoggedInUserID}
        count={{ current: 0 }}
        fetchData={mockFetchData}
        totalLength={{ current: 0 }}
      />,
    );

    expect(getByText('No Posts Available.')).toBeInTheDocument();
  });

  // Add more tests as needed
});
