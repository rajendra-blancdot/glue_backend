const jwt = require('jsonwebtoken');
const fs = require('fs');

const privateKEY  = fs.readFileSync('./config/crld_private.key', 'utf8');
const publicKEY  = fs.readFileSync('./config/crld_public.key', 'utf8');  
//const privateKEY  = fs.readFileSync('./glue-api/config/crld_private.key', 'utf8');
//const publicKEY  = fs.readFileSync('./glue-api/config/crld_public.key', 'utf8');  

const signOptions = {
  issuer: 'Crowld',
  subject: 'Glue JWT',  
  expiresIn: '7d',
  algorithm: 'RS256'
};

const verifyOptions = {
  issuer: 'Crowld',
  subject:  'Glue JWT',  
  expiresIn:  '7d',
  algorithm: ['RS256']
};

module.exports = 
{
  sign: (payload) => {
    return jwt.sign(payload, privateKEY, signOptions);
 },
 
 verify: (token) => {
  try{
    return jwt.verify(token, publicKEY, verifyOptions);
  }catch (err){
    return false;
  }
 },
  
 decode: (token) => {
     return jwt.decode(token, {complete: true});
  }
 }
 