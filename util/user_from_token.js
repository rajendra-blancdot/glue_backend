const auth = require('../middleware/auth');

const userIdFromToken = async (request, response) => {
    let result;
    try {
      const token = request.headers["crowld-authorization"];
      result = await auth.decode(token);  
    } catch(e) {
      return response.status(401).json("Unauthorized - c501");
    }  
    const userId = result.payload.crowldId;  
    if (userId == undefined) {
      return response.status(401).json("Unauthorized - c502");
    }
    return userId;
  }
  
  module.exports = userIdFromToken
  