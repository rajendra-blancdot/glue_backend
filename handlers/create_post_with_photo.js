const pool = require('../connection');
const userIdFromToken = require('../util/user_from_token');
const uuid = require('uuid');
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const config = require('../config/config');

aws.config.update({
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    region: 'us-east-1'
  });

const s3 = new aws.S3();

const fileFilter = (request, file, cb) => {
  cb(null, true);
    /*if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(new Error('Unauthorized - 405'), false);
    }*/
  }

const upload = (fileKey) => multer({
    fileFilter,
    limits: { fileSize: 10*1000*1000 }, // 10485760 = 10Mb. 
    storage: multerS3({
      acl: 'public-read',
      s3,
      bucket: config.AWS_BUCKET_NAME,
      metadata: function (request, file, cb) {
        cb(null, {fieldName: 'Crowld Mobile Image'});
      },
      key: function (request, file, cb) {
        cb(null, fileKey)
      }
    })
  });

const createPostWithPhoto = async function (request, response) {
  const userId = await userIdFromToken(request, response);
  const mediaId = uuid.v4();
  const fileKey = userId + '/' + mediaId + '.jpeg';
  const singleUpload = upload(fileKey).single('image');
  singleUpload(request, response, function(err) {
      if (err) {
          console.log(err);
          return request.status(422).send({errors: 'Photo Upload Error', detail: err.message});
      }
      const fileLocation = request.file.location;
      const {mediaType, textContent} = request.body;
      const postId = uuid.v4();
      //TODO: need to be modified to have trnasaction
      pool.query('INSERT INTO post_data (id, text_content, user_id) VALUES($1, $2, $3)', [postId, textContent, userId], (error, results) => {
        if (error) {
          console.log(error);
          return response.status(401).json("Unauthorized - c402");
        }
        pool.query('INSERT INTO post_media (id, media_url, media_type, bucket_name) VALUES($1, $2, $3, $4)', [mediaId, fileLocation, mediaType, config.AWS_BUCKET_NAME], (error, results) => {
          if (error) {
            console.log(error);
            return response.status(401).json("Unauthorized - c403");
          }
          pool.query('INSERT INTO post_data_media (post_data_id, media_id) VALUES($1, $2)', [postId, mediaId], (error, results) => {
            if (error) {
              console.log(error);
              return response.status(401).json("Unauthorized - c404");
            }
            return response.json({'status': 'success'});
          });                
        });
      });      
  });
}
  
module.exports = createPostWithPhoto;
