const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (_,_2, cb)=>{
        const basicPath = __dirname.replace('api\\middleware', '')
        cb(null, path.join(basicPath, '/images/customers'))
    },
    filename: (_, file, cb) => {
              cb(null, Date.now() + path.extname(file.originalname))
            },
});
const upload = multer({storage});

module.exports = upload;