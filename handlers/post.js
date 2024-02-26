const pool = require('../connection');
const userIdFromToken = require('../util/user_from_token');

const reportBad = async (request, response) => {
  const {postId} = request.body;
  const userId = await userIdFromToken(request, response);
  pool.query('INSERT INTO post_report (post_data_id, reported_by, reported_at) VALUES($1, $2, timezone(\'utc\'::text, now())) ' +
      'ON CONFLICT(post_data_id) DO UPDATE SET reported_at = timezone(\'utc\'::text, now())', [postId, userId], (error, results) => {
    if (error) {
      console.log(error);
      return response.status(401).json("Unauthorized - c600");
    }
    return response.status(200).json({status: 'success'});
  });
};

module.exports = reportBad;
