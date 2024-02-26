const auth = require('./auth');
const Validator = require('fastest-validator');
const validate = new Validator();

const loginSchema = {
    emailId: { type: "email", min:5, max:30},
    password: { type: "string", min:6, max:20}
};

const createUserSchema = {
    fullName: { type: "string", min:2, max:30 },
    originating_os: { type: "string", max:30, optional: true },
    originating_ip: { type: "string", max:30, optional: true },
    device: { type: "string", max:30, optional: true },
    screenName: { type: "string", min:4, max:30 },
    chatId: { type: "string", min:15, max: 50, optional: true },
    countryCode: { type: "string", min:1, max:7},
    email: { type: "email", min:5, max:30, optional: true },
    phoneNumber: { type: "string", min:5, max:10 },
    avatarUrl: { type: "url", min:5, max:30, optional: true },
    basic: { type: "string", min:8, max:30 },
    chatIdB: { type: "string", min:15, max: 50, optional: true },
};

const updateUserSchema = {
    userId: { type: "uuid" },
    chatId: { type: "uuid" },
    chatIdB: { type: "uuid" }
};

const userByIdSchema = {
    id: { type: "uuid" },
};

const loginCheck = validate.compile(loginSchema);
const createUserCheck = validate.compile(createUserSchema);
const userByIdCheck = validate.compile(userByIdSchema);
const updateUserCheck = validate.compile(updateUserSchema);

const verifyToken = async (request, response, next) => {
    const token = request.headers["crowld-authorization"];
    const result = await auth.verify(token);  
    if (result) {            
        next();
    } else {
        //console.log(result);
        response.status(401).json("Unauthorized - c200");
    }
 };         

const login = (request, response, next) => {
        const {emailId, password} = request.body;  
        const result = loginCheck({'emailId': emailId, 
                                   'password': password});
        if (result == true) {            
            next();
        } else {
            console.log(result);
            response.status(401).json("Unauthorized - c201");
        }
   };    

const createUser = (request, response, next) => {
    const {fullName, screenName, chatId, countryCode, phoneNumber, email, avatarUrl, basic, chatIdB, originating_os, originating_ip, device} = request.body;
    const result = createUserCheck({'fullName': fullName, 
                                    'originating_os': originating_os,
                                    'originating_ip': originating_ip,
                                    'device': device,
                                    'screenName': screenName, 
                                    'chatId': chatId, 
                                    'countryCode': countryCode, 
                                    'phoneNumber': phoneNumber, 
                                    'email' : email, 
                                    'avatarUrl': avatarUrl, 
                                    'basic': basic,
                                    'chatIdB': chatIdB});
    if (result == true) {            
        next();
    } else {
        console.log(result);
        response.status(401).json("Unauthorized - c202");
    }
};  

const updateUser = (request, response, next) => {
    const {userId, chatId, chatIdB} = request.body;
    const result = updateUserCheck({'userId': userId, 
                                    'chatId': chatId,
                                    'chatIdB': chatIdB});
    if (result == true) {            
        next();
    } else {
        console.log(result);
        response.status(401).json("Unauthorized - c204");
    }
};  

module.exports = {verifyToken, login, createUser, updateUser};
