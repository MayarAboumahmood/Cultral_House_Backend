const multer = require('multer');
const path = require('path');


const upload = (des) => {
  
    const storage =  multer.diskStorage(
            {
            destination: (_,_2, cb)=>{
                const basicPath = __dirname.replace('api\\middleware', '')
                cb(null, path.join(basicPath, `/images/${des}`))
            },
            filename: (_, file, cb) => {
                      cb(null, Date.now() + path.extname(file.originalname))
                    },
        });
    return multer({ storage });
  };

module.exports = upload;



