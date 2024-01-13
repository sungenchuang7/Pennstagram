import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import CommentBox from '../components/CommentBox';
import { patchPostData } from '../api/API';

jest.mock('../api/API');

const mockCommentList = [{ userID: 'user1', text: 'Test comment' }];
const mockID = '123';
const mockLoggedInUserID = 'user2';

describe('CommentBox', () => {
  it('adds a new comment on button click', async () => {
    render(
      <Router>
        <CommentBox
          commentList={mockCommentList}
          id={mockID}
          loggedInUserID={mockLoggedInUserID}
        />
      </Router>,
    );

    fireEvent.change(screen.getByPlaceholderText('Add a comment!'), { target: { value: 'New comment' } });
    fireEvent.click(screen.getByText('Add'));

    expect(patchPostData).toHaveBeenCalledWith(mockID, { commentList: [...mockCommentList, { userID: mockLoggedInUserID, text: 'New comment' }] });
    // Additional assertions...
  });
});
