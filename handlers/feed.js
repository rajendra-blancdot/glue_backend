const pool = require('../connection');
const userIdFromToken = require('../util/user_from_token');

const feedByUserId = async (request, response) => {
  const userId = await userIdFromToken(request, response);
    pool.query('select ui2.id as "postUserId", ui2.full_name as "fullName", ui2.screen_name as "screenName", ui2.avatar_url as "avatarUrl", ' +
    'pd.id as "postDataId", pd.text_content as "textContent",  pd.love_count as "loveCount", pd.chat_count as "chatCount", pd.stamp_count as "stampCount",' +
    '(select pm.media_url ' +
    'from post_data_media pdm, post_media pm ' +
    'where pdm.post_data_id = pd.id ' +
    'and pdm.media_id = pm.id ) as "mediaUrl",' +
    '(select pm.media_type ' +
    'from post_data_media pdm, post_media pm ' +
    'where pdm.post_data_id = pd.id ' +
    'and pdm.media_id = pm.id ) as "mediaType" ' +
    'from user_info ui, user_feed uf, post_data pd, user_info ui2 ' +
    'where ui.id = uf.user_id ' +
    'and uf.post_data_id = pd.id ' +
    'and pd.user_id = ui2.id ' +
    'and ui.id = $1 ' +
    'union ' +
    'select ui2.id as "postUserId", ui2.full_name as "fullName", ui2.screen_name as "screenName", ui2.avatar_url as "avatarUrl", ' +
        'pd.id as "postDataId", pd.text_content as "textContent",  pd.love_count as "loveCount", pd.chat_count as "chatCount", pd.stamp_count as "stampCount",' +
    '(select pm.media_url ' +
    'from post_data_media pdm, post_media pm ' +
    'where pdm.post_data_id = pd.id ' +
    'and pdm.media_id = pm.id ) as "mediaUrl", ' +
    '(select pm.media_type ' +
    'from post_data_media pdm, post_media pm ' +
    'where pdm.post_data_id = pd.id ' +
    'and pdm.media_id = pm.id ) as "mediaType" ' +
    'from user_info ui, common_feed cf, post_data pd, user_info ui2 ' +
    'where  cf.post_data_id = pd.id ' +
    'and pd.user_id = ui2.id' , [userId], (error, results) => {
    if (error) {
      console.log("***userId:" + userId);
        console.log(error);
        return response.status(401).json("Unauthorized - c501");
    }
    response.status(200).json(results.rows);
    });
  };

const ownPosts = async (request, response) => {
  let {userId} = request.params;
  if (userId == undefined) {
    userId = await userIdFromToken(request, response);
  }
    pool.query('select pd.id as "postDataId", pd.text_content as "textContent",  pd.love_count as "loveCount", pd.chat_count as "chatCount", pd.stamp_count as "stampCount", ' +
      '(select pm.media_url ' +
      'from post_data_media pdm, post_media pm ' +
      'where pdm.post_data_id = pd.id ' + 
      'and pdm.media_id = pm.id ) as "mediaUrl", ' +
      '(select pm.media_type ' +
      'from post_data_media pdm, post_media pm ' +
      'where pdm.post_data_id = pd.id ' + 
      'and pdm.media_id = pm.id ) as "mediaType" ' +
      'from post_data pd ' +
      'where pd.user_id = $1 ', [userId], (error, results) => {
    if (error) {
      console.log(error);
      return response.status(401).json("Unauthorized - c502");
    }
    response.status(200).json(results.rows);
    });
  };


module.exports = {feedByUserId, ownPosts};
