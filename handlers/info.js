class Info {
    index(req, res, next) {
      try {
        const {version, version_build} = require('../package.json')
        res.status(200).json({
          info: 'Glue Api Interface!',
          codeVersion: version
        });
      } catch (err) {
        next(err);
      }
    }
  }
  
const info = new Info();
module.exports = info.index
