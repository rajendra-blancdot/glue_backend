const Pool = require('pg').Pool
/*
const pool = new Pool({
  user: process.env.RDS_USERNAME ,
  host: process.env.RDS_HOSTNAME,
  database: 'stickyplaydb' ,
  password: process.env.RDS_PASSWORD ,
  port: process.env.RDS_PORT 
})
*/

const pool = new Pool({
    user: 'postuser' ,
    host: 'aafsfpuv8ktyr5.cv53kaobkc9c.us-east-1.rds.amazonaws.com',
    database:'stickyplaydb' ,
    password: 'Kums1234' ,
    port: 5432 
  });
  

module.exports = pool;
