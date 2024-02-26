const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
  });

const info = require('./handlers/info');
const user = require('./handlers/user');
const feed = require('./handlers/feed');
const createPost = require('./handlers/create_post');
const createPostWithPhoto = require('./handlers/create_post_with_photo');
const postBad = require('./handlers/post');
const validator = require('./middleware/validator');

//Unauthorized Zone
app.post('/api/v1/u', validator.createUser, user.createUser);
app.post('/api/v1/l', validator.login, user.login);

//Authorized Zone
app.get('/api/v1/info', validator.verifyToken, info);

app.get('/api/v1/u', validator.verifyToken, user.userById);
app.patch('/api/v1/u', validator.verifyToken, validator.updateUser, user.updateUser);

app.get('/api/v1/f', validator.verifyToken, feed.feedByUserId);
app.get('/api/v1/p', validator.verifyToken, feed.ownPosts);
app.post('/api/v1/tp', validator.verifyToken, createPost);
app.post('/api/v1/pp', validator.verifyToken, createPostWithPhoto);
app.post('/api/v1/ri', validator.verifyToken, postBad);

module.exports = app;
