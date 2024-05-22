// index.js (Server-side Code)
const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');

const app = express();

// Configure AWS S3 with the custom endpoint
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'YOUR_S3_REGION', // Replace with your S3 region 
    endpoint: 'https://s3.tebi.io' // Set the custom S3 endpoint
});

// Middleware for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Route to fetch objects from S3
app.get('/s3/:bucket/:key', async (req, res) => {
    const { bucket, key } = req.params;

    try {
        const params = {
            Bucket: bucket,
            Key: key
        };
        const data = await s3.getObject(params).promise();
        res.setHeader('Content-Type', data.ContentType);
        res.send(data.Body);
    } catch (err) {
        res.status(500).send('Error retrieving object');
    }
});

// Route for file upload
app.post('/s3/upload/:bucket/:key', upload.single('file'), async (req, res) => {
    const { bucket, key } = req.params;

    try {
        const file = req.file;
        const params = {
            Bucket: bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype
        };

        await s3.upload(params).promise();
        res.status(200).send('File uploaded successfully!');
    } catch (err) {
        res.status(500).send('Error uploading file');
    }
});

// Route for file download
app.get('/s3/download/:bucket/:key', async (req, res) => {
    const { bucket, key } = req.params;

    try {
        const params = {
            Bucket: bucket,
            Key: key
        };
        const data = await s3.getObject(params).promise();
        res.setHeader('Content-Type', data.ContentType);
        res.send(data.Body);
    } catch (err) {
        res.status(500).send('Error downloading file');
    }
});

// Serve the HTML front-end
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start the server
const port = process.env.PORT || 3000; 
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});