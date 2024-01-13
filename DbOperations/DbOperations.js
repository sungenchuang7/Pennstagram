const { MongoClient, ObjectId } = require('mongodb');

const dbURL = 'mongodb+srv://yangzl:k9QIwX7WVwVMRpOF@cis557project.8fbvm22.mongodb.net/?retryWrites=true&w=majority';

let MongoConnection;

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

// get the database
const getDB = async () => {
  if (!MongoConnection) {
    await connect();
  }
  return MongoConnection.db('Pennstagram');
};

// close the database
const closeDB = async () => {
  await MongoConnection.close();
};

const getUserPost = async (userID) => {
  let result;
  try {
    const db = await getDB();
    result = await db.collection('Post').find({ userID }).toArray();
  } catch (e) {
    console.log(`error: ${e.message}`);
    return [];
  }
  return result;
};

const getUser = async (userID) => {
  let result;
  try {
    const db = await getDB();
    result = await db.collection('User').find({ userID }).toArray();
  } catch (e) {
    /* eslint-disable no-console */
    console.log(`error: ${e.message}`);
    return [];
  }
  return result;
};

const getPost = async (postID) => {
  let result;
  try {
    const db = await getDB();
    result = await db.collection('Post').find({ _id: new ObjectId(postID) }).toArray();
  } catch (e) {
    console.log(`error: ${e.message}`);
    return [];
  }
  return result;
};

// get all users' info
const getAllUsers = async () => {
  let result;
  try {
    const db = await getDB();
    result = await db.collection('User').find({}).toArray();
  } catch (e) {
    /* eslint-disable no-console */
    console.log(`error: ${e.message}`);
    return [];
  }
  return result;
};

// get all posts
const getAllPosts = async () => {
  let result;
  try {
    const db = await getDB();
    result = await db.collection('Post').find({}).toArray();
  } catch (e) {
    /* eslint-disable no-console */
    console.log(`error: ${e.message}`);
    return [];
  }
  return result;
};

const createNewUser = async (user) => {
  let result;
  try {
    const db = await getDB();
    result = await db.collection('User').insertOne(user).insertedId;
  } catch (e) {
    /* eslint-disable no-console */
    console.log(`error: ${e.message}`);
    return undefined;
  }
  return result;
};

const createNewPost = async (post) => {
  let result;
  try {
    const db = await getDB();
    const response = await db.collection('Post').insertOne(post);
    result = response.insertedId; // Accessing insertedId from the response object
  } catch (e) {
    /* eslint-disable no-console */
    console.log(`error: ${e.message}`);
    return undefined;
  }
  return result;
};

// const addPost = async (post) => {
//   let result;
//   try {
//     const db = await getDB();
//     result = await db.collection('Post').insertOne(post).insertedId;
//   } catch (e) {
//     console.log(`error: ${e.message}`);
//   }
//   return result;
// };

const deletePost = async (id) => {
  let result;
  try {
    const db = await getDB();
    console.log(`deletePost in db id: ${id}`);
    result = await db.collection('Post').deleteOne({ _id: new ObjectId(id) });
  } catch (e) {
    /* eslint-disable no-console */
    console.log(`error: ${e.message}`);
    return undefined;
  }
  return result;
};

const updateUserData = async (id, data) => {
  let result;
  try {
    const db = await getDB();
    const filter = { _id: new ObjectId(id) };
    const updateDoc = { $set: data };
    result = await db.collection('User').updateOne(filter, updateDoc);
  } catch (e) {
    /* eslint-disable no-console */
    console.log(`error: ${e.message}`);
    return undefined;
  }
  return result;
};

const updatePostData = async (id, data) => {
  let result;
  try {
    const db = await getDB();
    const filter = { _id: new ObjectId(id) };
    const updateDoc = { $set: data };
    result = await db.collection('Post').updateOne(filter, updateDoc);
  } catch (e) {
    /* eslint-disable no-console */
    console.log(`error: ${e.message}`);
    return undefined;
  }
  return result;
};

module.exports = {
  connect,
  getDB,
  closeDB,
  getUser,
  getAllUsers,
  getAllPosts,
  createNewUser,
  updateUserData,
  deletePost,
  createNewPost,
  updatePostData,
  getPost,
  getUserPost,
};
