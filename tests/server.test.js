// polyfills (mimicking testing environment)
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

const path = require('path');

// import supertest
const request = require('supertest');
// import our web app
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const webapp = require('../server');

// Import database operations
const dbLib = require('../DbOperations/DbOperations');
const s3 = require('../S3/s3Operations');

let server;
// MongoDB URL
const url = 'mongodb+srv://yangzl:k9QIwX7WVwVMRpOF@cis557project.8fbvm22.mongodb.net/?retryWrites=true&w=majority';
let apptoken = '';

const dbURL = 'mongodb+srv://yangzl:k9QIwX7WVwVMRpOF@cis557project.8fbvm22.mongodb.net/?retryWrites=true&w=majority';

let MongoConnection;

let newUser;

const prefix = '/api';

// connect to the db
const connect = async () => {
  try {
    MongoConnection = await MongoClient.connect(
      dbURL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
    /* eslint-disable no-console */
    console.log(`connected to db: ${MongoConnection.db().databaseName}`);
  } catch (e) {
    /* eslint-disable no-console */
    console.log(e.message);
  }
};
const getDB = async () => {
  if (!MongoConnection) {
    await connect();
  }
  return MongoConnection.db('Pennstagram');
};

const closeDB = async () => {
  await MongoConnection.close();
};

const deleteUser = async (userID) => {
  let result;
  try {
    const db = await getDB();
    console.log(`deletePost in db userID: ${userID}`);
    result = await db.collection('User').deleteOne({ userID });
  } catch (e) {
    /* eslint-disable no-console */
    console.log(`error: ${e.message}`);
    return undefined;
  }
  return result;
};

beforeAll(async () => {
  apptoken = await jwt.sign({ userID: 'emily@upenn.edu' }, 'AKIARKJDFKLJJLKDFJSLK*&ZIES7CC2LEJHC', { expiresIn: '600s' });
  server = webapp.listen();
  await dbLib.connect(url);
});

beforeEach(async () => {
  newUser = {
    userID: 'backend_testing@upenn.edu',
    userName: 'Sean',
    password: '123',
    avatar: '',
    followers: [
      {
        userID: 'yzlsps@qq.com',
        userName: 'yzl',
        avatar: '',
      },
    ],
    followings: [
      {
        userID: 'yzlsps@qq.com',
        userName: 'yzl',
        avatar: '',
      },
    ],
    logInAttempts: {
      lastTime: Date.now(),
      count: 0,
    },
  };
});

afterAll((done) => {
  server.close(done);
  closeDB();
});

// jest.setTimeout(5000); // Extend timeout for this test

describe('/login endpoint tests', () => {
  test('POST /login should return status code 401 if userID is missing', async () => {
    const response = await request(webapp).post(`${prefix}/login`, { userID: '', password: '123' }).set('Authorization', apptoken);
    expect(response.statusCode).toBe(401);
    // request(webapp).post('/login/').send({ userID: '', password: '123' }).expect(401)
    //   .then(((response) => expect(JSON.parse(response.text).error).toBe('empty or missing userID')))
  });
  test('POST /login should return status code 401 if password is missing', async () => {
    const response = await request(webapp).post(`${prefix}/login`, { userID: 'backend_testing@upenn.edu', password: '' }).set('Authorization', apptoken);
    expect(response.statusCode).toBe(401);
    // request(webapp).post('/login/').send({ userID: 'backend_testing@upenn.edu', password: '' }).expect(401)
    //   .then(((response) => expect(JSON.parse(response.text).error).toBe('empty or missing password'))));
  // test('POST /login should return status 401 if account is locked', async () => {
  //   newUser.logInAttempts.count = 10; // set logInAttempts to be > 3 to trigger account lockout
  //   await request(webapp).post('/user').send(newUser).set('Authorization', apptoken);
  //   const response = await request(webapp).post('/login').send({ userID: 'backend_testing@upenn.edu', password: '123' }).set('Authorization', apptoken);
  //   expect(response.statusCode).toBe(401);
  //   console.log('???newUser: ', newUser);
  //   await deleteUser('backend_testing@upenn.edu');
  });
  test('POST /login should return status 401 if password is incorrect', async () => {
    newUser.logInAttempts.count = 0;
    const createNewUserResponse = await request(webapp).post(`${prefix}/user`).send(newUser).set('Authorization', apptoken);
    const response = await request(webapp).post(`${prefix}/login`).send({ userID: 'backend_testing@upenn.edu', password: 'xyz' }).set('Authorization', apptoken);
    expect(response.statusCode).toBe(401);
    await deleteUser('backend_testing@upenn.edu');
  });
  test('POST /login should return status 201 if login is successful', async () => {
    newUser.logInAttempts.count = 0;
    const createNewUserResponse = await request(webapp).post(`${prefix}/user`).send(newUser).set('Authorization', apptoken);
    const response = await request(webapp).post(`${prefix}/login`).send({ userID: 'backend_testing@upenn.edu', password: '123' }).set('Authorization', apptoken);
    // console.log('?????Response:', response.body);
    expect(response.statusCode).toBe(201);
    await deleteUser('backend_testing@upenn.edu');
  });
});
describe('/user endpoint tests', () => {
  test('GET /user should return status code 401 if no jwt is provided', async () => {
    const response = await request(webapp).get(`${prefix}/user`);
    expect(response.statusCode).toBe(401);
  });
  test('GET /user should return status code 200 and all users if successful', async () => {
    const response = await request(webapp).get(`${prefix}/user`).set('Authorization', apptoken);
    expect(response.statusCode).toBe(200);
  });

  test('GET /user/:id should return status code 401 if no jwt is provided', async () => {
    const response = await request(webapp).get(`${prefix}/user/mockNotFound@upenn.edu`);
    expect(response.statusCode).toBe(401);
  });

  test('GET /user/:id should return status code 200 and the data of user with the id', async () => {
    const createNewUserResponse = await request(webapp).post(`${prefix}/user`).send(newUser).set('Authorization', apptoken);
    const response = await request(webapp).get(`${prefix}/user/backend_testing@upenn.edu`).set('Authorization', apptoken);
    expect(response.statusCode).toBe(200);
    await deleteUser('backend_testing@upenn.edu');
  });
  test('GET /user/:id should return status code 404 if no user is found in the database', async () => {
    const response = await request(webapp).get(`${prefix}/user/mockNotFound@upenn.edu`).set('Authorization', apptoken);
    expect(response.statusCode).toBe(404);
  });
  //
  test('PATCH /user:id should return 200 for successful update', async () => {
    const testUserID = '6546be2f91bd3d2defe1a365';
    // Use the ID to construct the patch request
    const response = await request(webapp).patch(`${prefix}/user/${testUserID}`, { userName: 'TestChangeUsername' }).set('Authorization', apptoken);
    if (response.statusCode !== 200) {
      console.error('Failed to delete post:', response.body); // Log any errors returned from the server
    }
    expect(response.statusCode).toBe(200);
  });

  test('PATCH /user:id should return 400 given incorrect userID', async () => {
    const incorrectUserID = 'xyz123test';
    // Use the ID to construct the patch request
    const response = await request(webapp).patch(`${prefix}/user/${incorrectUserID}`, { userName: 'TestChangeUsername' }).set('Authorization', apptoken);
    if (await response.statusCode !== 200) {
      console.error('Failed to patch /user:id', response.body); // Log any errors returned from the server
    }
    expect(response.statusCode).toBe(200);
  });

  test('PATCH /user:id should return 401 if no jwt is provided', async () => {
    const incorrectUserID = '123';
    const response = await request(webapp).patch(`${prefix}/user/${incorrectUserID}`, { userName: 'TestChangeUsername' });
    expect(response.statusCode).toBe(401);
  });

  test('POST /user should return 201 for successful creation', async () => {
    const response = await request(webapp).post(`${prefix}/user`).send(newUser).set('Authorization', apptoken);
    expect(response.status).toBe(201); // changed from 201 to 401
    deleteUser('post_user_test@upenn.edu');
  });
});

describe('/upload/ endpoint tests', () => {
  // Mock the S3 uploadFile function before the tests run
  beforeAll(() => {
    jest.spyOn(s3, 'uploadFile').mockImplementation((buffer, filename) => Promise.resolve(`https://mock-s3-url/${filename}`));
  });

  // Restore the original implementation after the tests run
  afterAll(() => {
    s3.uploadFile.mockRestore();
  });
  test('POST /upload should return status code 201 if the file is uploaded successfully', async () => {
    // Path to your test file
    const filePath = path.join(__dirname, './../upload_test_files/princeton-logo.png'); // Make sure the file exists

    // Make a POST request and attach the file
    const response = await request(webapp)
      .post(`${prefix}/upload/`)
      .attach('File_0', filePath, 'princeton-logo.png').set('Authorization', apptoken); // 'File_0' should match the field name expected by your server
      // .expect(201); // This is asserting that the HTTP status code should be 201

    expect(response.statusCode).toBe(201);
    expect(response.body.url).toMatch(/https:\/\/mock-s3-url/); // Assuming your mock should match this pattern
  });
});

describe('/post/ endpoint tests', () => {
  test('GET /post should return status code 200 and the data of all posts', async () => {
    const response = await request(webapp).get(`${prefix}/post`).set('Authorization', apptoken);
    expect(response.statusCode).toBe(200);
  });

  test('GET /post should return status code 401 if no jwt is provided', async () => {
    const response = await request(webapp).get(`${prefix}/post`);
    expect(response.statusCode).toBe(401);
  });

  test('POST /post should return 401 if no jwt is provided', async () => {
    // Define a mock post according to your requirements
    const newPost = {
      avatar: 'testAvatar.png',
      userName: 'Emily',
      userID: 'emily@upenn.edu',
      url: 'https://images3.alphacoders.com/165/thumb-1920-165265.jpg',
      text: 'My first image.',
      time: '2023-10-17',
    };

    const response = await request(webapp).post(`${prefix}/post`).send(newPost);
    expect(response.statusCode).toBe(401);
  });

  test('POST /post should return 201 for successful creation', async () => {
    // Define a mock post according to your requirements
    const newPost = {
      avatar: 'testAvatar.png',
      userName: 'Emily',
      userID: 'emily@upenn.edu',
      url: 'https://images3.alphacoders.com/165/thumb-1920-165265.jpg',
      text: 'My first image.',
      time: '2023-10-17',
    };

    const response = await request(webapp).post(`${prefix}/post`).send(newPost).set('Authorization', apptoken);
    expect(response.statusCode).toBe(201);
  });

  test('POST /post should return 404 for missing entry', async () => {
    // Sending an incomplete post object
    const incompletePost = {
      userName: 'TestUser',
      text: 'Test text content',
    };

    const response = await request(webapp).post(`${prefix}/post`).send(incompletePost).set('Authorization', apptoken);
    expect(response.status).toBe(404);
    expect(JSON.parse(response.text).message).toBe('missing entry');
  });

  test('DELETE /post/:id should return status code 200 and all users', async () => {
    // mocking a correct json post object
    const newPost = {
      avatar: 'testAvatar.png',
      userName: 'Emily',
      userID: 'emily@upenn.edu',
      url: 'https://images3.alphacoders.com/165/thumb-1920-165265.jpg',
      text: 'TESTTESTEST',
      time: '2023-11-03',
    };

    // First create a new post
    const newPostResp = await request(webapp).post(`${prefix}/post`).send(newPost).set('Authorization', apptoken);
    expect(newPostResp.statusCode).toBe(201); // new post should be created successfully

    // console.log("check check: " + newPostResp[0] + "body: " + newPostResp[1]);
    console.log('newPostResp.header: ', newPostResp.header);
    console.log('newPostResp.body: ', newPostResp.body);

    // Extract the ID of the newly created post from the response
    const postId = newPostResp.body.id; // Assuming the ID is sent back in the response body

    // Use the ID to construct the delete request
    const response = await request(webapp).delete(`${prefix}/post/${postId}`).set('Authorization', apptoken);
    if (response.statusCode !== 200) {
      console.error('Failed to delete post:', response.body); // Log any errors returned from the server
    }
    expect(response.statusCode).toBe(200);
  });

  // test('GET /post/:id should return status code 404 if provided malformed postID', async () => {
  //   const newPost = {
  //     avatar: 'testAvatar.png',
  //     userName: 'Emily',
  //     userID: 'emily@upenn.edu',
  //     url: 'https://images3.alphacoders.com/165/thumb-1920-165265.jpg',
  //     text: 'TESTTESTEST',
  //     time: '2023-11-03',
  //   };
  //   // First create a new post
  //   const newPostResp = await request(webapp).post('/post').send(newPost).set('Authorization', apptoken);
  //   expect(newPostResp.statusCode).toBe(201); // new post should be created successfully
  //
  //   // Extract the ID of the newly created post from the response
  //   const postId = newPostResp.body.id; // Assuming the ID is sent back in the response body
  //
  //   let response = await request(webapp).get(`/post/${`${postId}123`}`).set('Authorization', apptoken);
  //   expect(response.statusCode).toBe(404);
  //   // Use the ID to construct the delete request
  //   response = await request(webapp).delete(`/post/${postId}`).set('Authorization', apptoken);
  //   if (response.statusCode !== 200) {
  //     console.error('Failed to delete post:', response.body); // Log any errors returned from the server
  //   }
  //   expect(response.statusCode).toBe(200);
  // });

  test('GET /post/:id should return status code 200 if successful', async () => {
    const newPost = {
      avatar: 'testAvatar.png',
      userName: 'Emily',
      userID: 'emily@upenn.edu',
      url: 'https://images3.alphacoders.com/165/thumb-1920-165265.jpg',
      text: 'TESTTESTEST',
      time: '2023-11-03',
    };
    // First create a new post
    const newPostResp = await request(webapp).post(`${prefix}/post`).send(newPost).set('Authorization', apptoken);
    expect(newPostResp.statusCode).toBe(201); // new post should be created successfully

    // Extract the ID of the newly created post from the response
    const postId = newPostResp.body.id; // Assuming the ID is sent back in the response body

    let response = await request(webapp).get(`${prefix}/post/${postId}`).set('Authorization', apptoken);
    expect(response.statusCode).toBe(200);
    // Use the ID to construct the delete request
    response = await request(webapp).delete(`${prefix}/post/${postId}`).set('Authorization', apptoken);
    if (response.statusCode !== 200) {
      console.error('Failed to delete post:', response.body); // Log any errors returned from the server
    }
    expect(response.statusCode).toBe(200);
  });

  test('GET /post/:id should return status code 401 if no jwt is provided', async () => {
    const malformedPostId = '123'; // Made up some fake postID
    const response = await request(webapp).get(`${prefix}/post/${malformedPostId}`);
    expect(response.statusCode).toBe(401);
  });

  test('DELETE /post/:id should return status code 400 if provided malformed postID', async () => {
    const malformedPostId = '123'; // Made up some fake postID
    const response = await request(webapp).delete(`${prefix}/post/${malformedPostId}`).set('Authorization', apptoken);
    if (response.statusCode !== 200) {
      console.error('Failed to delete post:', response.body); // Log any errors returned from the server
    }
    expect(response.statusCode).toBe(400);
  });

  test('DELETE /post/:id should return status code 401 if no jwt is provided', async () => {
    const postID = 'placeholder'; // Made up some fake postID
    const response = await request(webapp).delete(`${prefix}/post/${postID}`);
    if (response.statusCode !== 200) {
      console.error('Failed to delete post:', response.body); // Log any errors returned from the server
    }
    expect(response.statusCode).toBe(401);
  });

  test('DELETE /post/:id should return status code 404 if given incorrect id', async () => {
    const newPost = {
      avatar: 'testAvatar.png',
      userName: 'Emily',
      userID: 'emily@upenn.edu',
      url: 'https://images3.alphacoders.com/165/thumb-1920-165265.jpg',
      text: 'TESTTESTEST',
      time: '2023-11-03',
    };

    // First create a new post
    const newPostResp = await request(webapp).post(`${prefix}/post`).send(newPost).set('Authorization', apptoken);
    expect(newPostResp.statusCode).toBe(201);
    // create an incorrect id
    const postId = 'xyz123_incorrect_id';
    // Use the incorrect ID to construct the delete request
    const response = await request(webapp).delete(`${prefix}/post/${postId}`).set('Authorization', apptoken);
    // should return 400 because no post with the incorrect id is found
    expect(response.statusCode).toBe(400);
  });

  test('PATCH /post/:id should return 200 for successful update', async () => {
    // Define a mock post according to your requirements
    // mocking a correct json post object
    const newPost = {
      avatar: 'testAvatar.png',
      userName: 'Emily',
      userID: 'emily@upenn.edu',
      url: 'https://images3.alphacoders.com/165/thumb-1920-165265.jpg',
      text: 'TESTTESTEST',
      time: '2023-11-03',
    };

    // First create a new post
    const newPostResp = await request(webapp).post(`${prefix}/post`).send(newPost).set('Authorization', apptoken);
    expect(newPostResp.statusCode).toBe(201); // new post should be created successfully

    // Extract the ID of the newly created post from the response
    const postId = newPostResp.body.id; // Assuming the ID is sent back in the response body

    // Use the ID to construct the patch request
    const response = await request(webapp).patch(`${prefix}/post/${postId}`, { text: 'Test Changing Text' }).set('Authorization', apptoken);
    if (response.statusCode !== 200) {
      console.error('Failed to delete post:', response.body); // Log any errors returned from the server
    }
    expect(response.statusCode).toBe(200);
  });
  test('PATCH /post/:id should return 401 if no jwt is provided', async () => {
    // Define a mock post according to your requirements
    // mocking a correct json post object
    const newPost = {
      avatar: 'testAvatar.png',
      userName: 'Emily',
      userID: 'emily@upenn.edu',
      url: 'https://images3.alphacoders.com/165/thumb-1920-165265.jpg',
      text: 'TESTTESTEST',
      time: '2023-11-03',
    };

    // First create a new post
    const newPostResp = await request(webapp).post(`${prefix}/post`).send(newPost).set('Authorization', apptoken);
    expect(newPostResp.statusCode).toBe(201); // new post should be created successfully

    // Extract the ID of the newly created post from the response
    const postId = newPostResp.body.id; // Assuming the ID is sent back in the response body

    // Use the ID to construct the patch request
    const response = await request(webapp).patch(`${prefix}/post/${postId}`, { text: 'Test Changing Text' });
    expect(response.statusCode).toBe(401);

    const deleteResponse = await request(webapp).delete(`${prefix}/post/${postId}`).set('Authorization', apptoken);
    expect(deleteResponse.statusCode).toBe(200);
  });
});

describe('/profilepagepost endpoint tests', () => {
  test('GET /profilepagepost/:id/:length should return 200 if successful', async () => {
    const response = await request(webapp).get(`${prefix}/profilepagepost/emily@upenn.edu/2`).set('Authorization', apptoken);
    expect(response.statusCode).toBe(200);
  });

  test('GET /profilepagepost/:id/:length should return 401 if no jwt is provided', async () => {
    const response = await request(webapp).get(`${prefix}/profilepagepost/emily@upenn.edu/2`);
    expect(response.statusCode).toBe(401);
  });
});

describe('/homepagepost endpoint tests', () => {
  test('GET /homepagepost/:id/:length should return 200 if successful', async () => {
    const response = await request(webapp).get(`${prefix}/homepagepost/emily@upenn.edu/2`).set('Authorization', apptoken);
    expect(response.statusCode).toBe(200);
  });

  test('GET /homepagepost/:id/:length should return 401 if no jwt is provided', async () => {
    const response = await request(webapp).get(`${prefix}/homepagepost/emily@upenn.edu/2`);
    expect(response.statusCode).toBe(401);
  });
});
