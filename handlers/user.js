const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const pool = require('../connection');
const auth = require('../middleware/auth');
const userIdFromToken = require('../util/user_from_token');

const userById = async (request, response) => {
  const userId = await userIdFromToken(request, response);
    pool.query('SELECT id, screen_name as "screenName", avatar_url as "avatarUrl", chat_id as "chatId", phone_number as "phoneNumber", email, country_code as "countryCode", full_name as "fullName" ' +
               'FROM user_info WHERE id = $1', [userId], (error, results) => {
      if (error) {
        return response.status(401).json({status: "Unauthorized - c105"});
      }
      return response.status(200).json(results.rows[0]);
    });
  };

const createUser = async (request, response) => {
  const {fullName, screenName, chatId, countryCode, phoneNumber, email, avatarUrl, basic, originating_os, originating_ip, device} = request.body;
  const userId = uuid.v4();
  const basicId =  await bcrypt.hash(basic, 10);
  pool.query('INSERT INTO user_info ' +
              '(id, originating_os, originating_ip, device, full_name, screen_name, chat_id, country_code, phone_number, email, avatar_url, basic_id) ' +
              'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [userId, originating_os, originating_ip, device, fullName, screenName, chatId, countryCode, phoneNumber, email, avatarUrl, basicId], async (error, results) => {
    if (error) {
      response.status(401).json({status: "Unauthorized - c100"});
      return;
    }
    const payload = { 
      crowldId: userId
    }
    const jwtToken = await auth.sign(payload);
    response.status(200).json({status:'success', id: userId, token: jwtToken});
  });
};

const updateUser = async (request, response) => {
  const {userId, chatId, chatIdB} = request.body;
  const cBasicId =  await bcrypt.hash(chatIdB, 10);
  pool.query('UPDATE user_info SET chat_id = $1, c_basic_id = $2 ' +
              'WHERE id = $3', [chatId, cBasicId, userId], async (error, results) => {
    if (error) {
      response.status(401).json({status: "Unauthorized - c101"});
      return;
    }
    response.status(200).json({status:'success'});
  });
};

const login = async (request, response) => {
  const {emailId, password} = request.body;  
  pool.query('SELECT id, basic_id as "basicId" FROM user_info WHERE email = $1 or phone_number = $1 or screen_name = $1', [emailId], async (error, results) => {
    if (error ||  results.rows == undefined || results.rows.length <= 0) {
      console.log(error);
      response.status(401).json({status: "Unauthorized - c102"}); 
      return;
    } 
    const basicId = results.rows[0].basicId;
    const crowldId = results.rows[0].id;
    try {
      let result = await bcrypt.compare(password, basicId);
      if (result) {
        const payload = { 
          crowldId: crowldId
        }
        const jwtToken = await auth.sign(payload);
        response.status(200).json({status:'success', token: jwtToken});
      } else {
        response.status(401).json({status: "Unauthorized - c103"}); 
      }  
    } catch (e) {
      response.status(401).json({status: "Unauthorized - c104"}); 
      return;
    }  
  });
};

module.exports = {userById, createUser, updateUser, login};
