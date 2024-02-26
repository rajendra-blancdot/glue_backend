const pool = require('../connection');
const uuid = require('uuid')
const userIdFromToken = require('../util/user_from_token');

const createPost = async (request, response) => {
  const {textContent} = request.body;
  const postId = uuid.v4();
  const userId = await userIdFromToken(request, response);
  pool.query('INSERT INTO post_data (id, text_content, user_id) VALUES($1, $2, $3)', [postId, textContent, userId], (error, results) => {
    if (error) {
      return response.status(401).json("Unauthorized - c302");
    }
    return response.status(200).json({status: 'success'});
  });
};

module.exports = createPost;
