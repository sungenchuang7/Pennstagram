// import fs
const fs = require('fs');

const path = require('path');

// import express
const express = require('express');

const cors = require('cors');

const formidable = require('formidable');

const bodyParser = require('body-parser');
const dbOpt = require('./DbOperations/DbOperations');

// import S3 operations
const s3 = require('./S3/s3Operations');

const { authenticateUser, verifyUser } = require('./auth');
const { getUser, getUserPost } = require('./DbOperations/DbOperations');

const webapp = express();
// Parse JSON request body
webapp.use(express.json());
webapp.use(cors());
webapp.use(express.urlencoded({ extended: true }));
// webapp.use(express.bodyParser({ limit: '50mb' }));
webapp.use(bodyParser.json({ limit: '50mb' })); // Set limit to a higher value like 10mb
webapp.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
webapp.use(express.static(path.join(__dirname, './frontend/build')));
const prefix = '/api';

webapp.post(`${prefix}/login`, async (req, resp) => {
  try {
    if (!req.body.userID || req.body.userID === '') {
      // check the name was sent in the body
      console.log('???req.body.userID: ', req.body.userID);
      resp.status(401).json({ error: 'empty or missing userID' });
      return;
    }
    if (!req.body.password || req.body.password === '') {
      console.log('???req.body.password: ', req.body.password);
      resp.status(401).json({ error: 'empty or missing password' });
      return;
    }
    const result = await getUser(req.body.userID);
    const [userData] = result;
    const { logInAttempts } = userData;
    const waitTime = 1; // in min

    // console.log('logInAttempts.count', logInAttempts.count);
    // console.log('logInAttempts.lastTime', logInAttempts.lastTime);
    // console.log('logInAttempts.count >= 3', logInAttempts.count >= 3);
    if ((logInAttempts.count >= 3)
        && (Date.now() - logInAttempts.lastTime < (waitTime * 60 * 1000))) {
      // console.log('Account locked');
      resp.status(401).json({ error: 'Account locked' });
      return;
    }
    const token = await authenticateUser(req.body.userID, req.body.password, userData);
    if (token) {
      // console.log('successfully created token');
      resp.status(201).json({ apptoken: token });
    } else {
      // console.log('wrong user info');
      resp.status(401).json({ error: 'Wrong user info' });
    }
  } catch (err) {
    console.log('WTF: shit happened.');
    resp.status(401).json({ error: err.message });
  }
});

// get all users
webapp.get(`${prefix}/user`, async (req, resp) => {
  try {
    if (await verifyUser(req.headers.authorization)) {
      // get the data from db
      const users = await dbOpt.getAllUsers();
      resp.status(200).json(users);
    } else {
      resp.status(401).json({ error: 'failed authentication' });
    }
  } catch (e) {
    resp.status(400).json({ message: 'There was an error' });
  }
});

// retrieve the info of a user
webapp.get(`${prefix}/user/:id`, async (req, resp) => {
  /* eslint-disable no-console */
  // console.log('READ a user');
  try {
    if (await verifyUser(req.headers.authorization)) {
      const result = await dbOpt.getUser(req.params.id);
      if (result.length === 0) {
        resp.status(404).json({ message: 'unknown students' });
        return;
      }
      resp.status(200).json(result);
    } else {
      resp.status(401).json({ error: 'failed authentication' });
    }
  } catch (error) {
    resp.status(400).json({ message: 'there was an error' });
  }
});

// create a new post
webapp.post(`${prefix}/post`, async (req, resp) => {
  try {
    if (await verifyUser(req.headers.authorization)) {
      if (
        !req.body.userName
          || !req.body.userID
          || !req.body.time
      ) {
        return resp.status(404).json({ message: 'missing entry' });
      }
      const newPost = {
        avatar: req.body.avatar || '',
        userName: req.body.userName || '',
        userID: req.body.userID || '',
        url: req.body.url || '',
        text: req.body.text || '',
        time: req.body.time || '',
      };
      const result = await dbOpt.createNewPost(newPost);
      return resp.status(201).json({ id: result });
    }
    return resp.status(401).json({ error: 'failed authentication' });
  } catch (e) {
    return resp.status(400).json({ message: 'There was an error' });
  }
});

// create new user
webapp.post(`${prefix}/user`, async (req, resp) => {
  /* eslint-disable no-console */
  // console.log('CREATE a new user');
  try {
    // verify that the user does not exist
    const userResult = await dbOpt.getUser(req.body.userID);
    if (userResult.length !== 0) {
      // the email already registered
      return resp.status(401).json({ message: 'Email already registered.' });
    }
    const newUser = {
      userID: req.body.userID || '',
      userName: req.body.userName || '',
      password: req.body.password || '',
      avatar: req.body.avatar || '',
      followers: req.body.followers || [],
      followings: req.body.followings || [],
      logInAttempts: req.body.logInAttempts || { lastTime: 0, count: 0 },
    };
    const result = await dbOpt.createNewUser(newUser);
    resp.status(201).json({ id: result });
  } catch (error) {
    resp.status(400).json({ message: 'There was an error' });
  }
});

// get a specific id
webapp.delete(`${prefix}/post/:id`, async (req, resp) => {
  try {
    if (await verifyUser(req.headers.authorization)) {
      const result = await dbOpt.deletePost(req.params.id);
      if (result.deleteCount === 0) {
        resp.status(404).json({ error: 'post not found' });
      }
      resp.status(200).json({ message: result });
    } else {
      resp.status(401).json({ error: 'failed authentication' });
    }
  } catch (err) {
    resp.status(400).json({ message: 'there was error' });
  }
});

// get all posts
webapp.get(`${prefix}/post`, async (req, resp) => {
  try {
    if (await verifyUser(req.headers.authorization)) {
      // get the data from db
      const posts = await dbOpt.getAllPosts();
      resp.status(200).json(posts);
    } else {
      resp.status(401).json({ error: 'failed authentication' });
    }
  } catch (e) {
    resp.status(400).json({ message: 'There was an error' });
  }
});

webapp.get(`${prefix}/profilepagepost/:id/:length`, async (req, resp) => {
  try {
    if (await verifyUser(req.headers.authorization)) {
      const userID = req.params.id;
      const { length } = req.params;
      let result = await getUserPost(userID);
      result = result.sort((a, b) => {
        // sort the avtivityFeed according to time
        const dateA = new Date(a.time);
        const dateB = new Date(b.time);

        if (dateA < dateB) return 1;
        if (dateA > dateB) return -1;
        return 0;
      });
      const totalLength = result.length;
      result = result.slice(0, length);
      resp.status(200).json({ posts: result, totalLength });
    } else {
      resp.status(401).json({ error: 'failed authentication' });
    }
  } catch (e) {
    resp.status(400).json({ message: 'There was an error' });
  }
});

webapp.get(`${prefix}/homepagepost/:id/:length`, async (req, resp) => {
  try {
    if (await verifyUser(req.headers.authorization)) {
      const userID = req.params.id;
      const { length } = req.params;
      let userInfo = await getUser(userID);
      [userInfo] = userInfo;
      const followingList = userInfo.followings || [];
      const followingUserID = [userID];
      followingList.forEach((item) => {
        // followingList is an array of object
        // I want to obtain each object's user ID
        followingUserID.push(item.userID);
      });

      const userHiddenPosts = userInfo.hiddenPosts || [];
      let posts = [];
      const userPostsPromise = followingUserID.map((ID) => getUserPost(ID));
      const resolvedPromise = await Promise.all(userPostsPromise);
      resolvedPromise.forEach((promise) => {
        posts = posts.concat(promise);
      });
      // eslint-disable-next-line no-underscore-dangle
      posts = posts.filter((post) => !userHiddenPosts.includes(post._id.toString()));
      posts = posts.sort((a, b) => {
        const dateA = new Date(a.time);
        const dateB = new Date(b.time);

        if (dateA < dateB) return 1;
        if (dateA > dateB) return -1;
        return 0;
      });
      const totalLength = posts.length;
      posts = posts.slice(0, length);
      resp.status(200).json({ posts, totalLength });
    } else {
      resp.status(401).json({ error: 'failed authentication' });
    }
  } catch (e) {
    resp.status(400).json({ message: 'There was an error' });
  }
});

// Retrieve a post object in JSON format, given its postID
webapp.get(`${prefix}/post/:id`, async (req, resp) => {
  try {
    if (await verifyUser(req.headers.authorization)) {
      // get the data from db
      const result = await dbOpt.getPost(req.params.id);
      // getPost() returns an array (should have exactly one JSON element in the array)
      if (result.length === 0) {
        resp.status(404).json({ message: 'Invalid postID. No matching post found.' });
      }
      resp.status(200).json(result);
    } else {
      resp.status(401).json({ error: 'failed authentication' });
    }
  } catch (e) {
    resp.status(400).json({ message: 'There was an error' });
  }
});

// patch post data
webapp.patch(`${prefix}/post/:id`, async (req, resp) => {
  try {
    if (await verifyUser(req.headers.authorization)) {
      const result = await dbOpt.updatePostData(req.params.id, req.body);
      resp.status(200).json({ message: result });
    } else {
      resp.status(401).json({ error: 'failed authentication' });
    }
  } catch (e) {
    resp.status(400).json({ message: 'There was an error' });
  }
});

// patch user data
webapp.patch(`${prefix}/user/:id`, async (req, resp) => {
  try {
    if (await verifyUser(req.headers.authorization)) {
      const result = await dbOpt.updateUserData(req.params.id, req.body);
      resp.status(200).json({ message: result });
    } else {
      resp.status(401).json({ error: 'failed authentication' });
    }
  } catch (e) {
    resp.status(400).json({ message: 'There was an error' });
  }
});

webapp.put(`${prefix}/avatar`, async (req, resp) => {
  try {
    resp.status(200);
  } catch (e) {
    resp.status(400).json({ message: 'There was an error' });
  }
});

// // upload endpoint with formidable
// webapp.post('/upload', async (req, res) => {
//   console.log('upload a file');
//   const form = new formidable.IncomingForm();
//   form.parse(req, (err, fields, files) => {
//     if (err) {
//       console.log('error', err.message);
//       res.status(404).json({ error: err.message });
//     }
//     // create a buffer to cache uploaded file
//     let cacheBuffer = Buffer.alloc(0);
//
//     // create a stream from the virtual path of the uploaded file
//     const fStream = fs.createReadStream(files.File_0[0].filepath);
//
//     fStream.on('data', (chunk) => {
//       // fill the buffer with data from the uploaded file
//       cacheBuffer = Buffer.concat([cacheBuffer, chunk]);
//     });
//
//     fStream.on('end', async () => {
//       // send buffer to AWS
//       const s3URL = await s3.uploadFile(cacheBuffer, files.File_0[0].filepath);
//       console.log('end', cacheBuffer.length);
//
//       // You can store the URL in mongoDB with the rest of the data
//       // send a response to the client
//       res.status(201).json({ message: `files uploaded at ${s3URL}` });
//     });
//   });
// });

// upload endpoint with formidable
webapp.post(`${prefix}/upload`, async (req, res) => {
  /* eslint-disable no-console */
  // console.log('upload a file');
  try {
    const form = formidable({}); // { multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.status(404).json({ error: err.message });
      }
      // create a buffer to cache uploaded file
      let cacheBuffer = Buffer.alloc(0);

      // create a stream from the virtual path of the uploaded file
      console.log('files', files);
      console.log('files.File_0', files.File_0);
      const fStream = fs.createReadStream(files.File_0.path);

      fStream.on('data', (chunk) => {
        // fill the buffer with data from the uploaded file
        cacheBuffer = Buffer.concat([cacheBuffer, chunk]);
      });

      fStream.on('end', async () => {
        // send buffer to AWS - The url of the object is returned
        const s3URL = await s3.uploadFile(cacheBuffer, files.File_0.name);
        // console.log('end', cacheBuffer.length);

        // You can store the URL in mongoDB along with the rest of the data
        // send a response to the client
        res.status(201).json({ url: s3URL });
      });
    });
  } catch (e) {
    res.status(400).json({ message: 'There was an error' });
  }
});

webapp.delete(`${prefix}/upload/:fileName`, async (req, res) => {
  try {
    const result = await s3.deleteFile(req.params.fileName);
    if (result) {
      // successfully delete it
      res.status(200).json({ message: 'Deleted' });
    } else {
      // unsuccessful
      res.status(400).json({ message: 'Unsuccessful' });
    }
  } catch (e) {
    res.status(400).json({ message: 'There was an error' });
  }
});

webapp.get('*', async (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// export the webapp
module.exports = webapp;
