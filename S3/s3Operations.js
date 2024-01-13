// const AWS = require('aws-sdk');
const { S3 } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');

// dotenv helps manage environment variables
require('dotenv').config();

const fs = require('fs');

// The name of the bucket that you have created
const BUCKET_NAME = 'cis-5570-project-yzl';

// we load credentials from the .env file
const s3 = new S3({
  credentials: {
    accessKeyId: process.env.ID,
    secretAccessKey: process.env.SECRET,
  },
  region: 'us-east-2', // need to change this accordingly
});

// upload a file
const uploadFile = async (fileContent, fileName) => {
  // Setting up S3 upload parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName, // File name we want to upload
    Body: fileContent,
  };

  // Uploading files to the bucket
  /**
     s3.upload(params, function(err, data) {
     if (err) {
     console.log('Error', err.message);
     }
     console.log(`File uploaded successfully. ${data.Location}`);
     return data.Location;
     });
     */
  // const data = await s3.upload(params).promise();
  // console.log(`File uploaded successfully. ${data.Location}`);
  // return data.Location;
  const data = await new Upload({
    client: s3,
    params,
  }).done();
  // return the URL of the object on S3
  return data.Location;
};

// retrieve a file
const retrieveFile = (fileName) => {
  // Setting up S3 read parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName, // File name we want to retrieve
  };

  // download file from the bucket
  s3.getObject(params, (err, data) => {
    if (err) {
      throw err;
    }
    // console.log(`File downloaded successfully. ${data.Body}`);
    // do something with the file
    const fStream = fs.createWriteStream(`${fileName}`);
    fStream.write(data.Body);
    fStream.end();
    // return data
    return data.Body;
  });
};

// delete a file
const deleteFile = async (fileName) => {
  // Setting up S3 delete parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName, // File name we want to delete
  };

  // download file from the bucket
  try {
    const data = await s3.deleteObject(params);
    /* eslint-disable no-console */
    console.log(`File deleted successfully. ${data}`);
    return true;
  } catch (err) {
    console.error('s3Operations unable to delete', err);
    return false;
  }
};

module.exports = { uploadFile, retrieveFile, deleteFile };
