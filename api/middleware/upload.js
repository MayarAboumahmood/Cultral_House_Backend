const multer = require('multer');
const path = require('path');


const upload = (des) => {

    const storage = multer.diskStorage(
        {
            destination: (_, _2, cb) => {
                cb(null,  `./images/${des}`)
            },
            filename: (_, file, cb) => {
                cb(null, Date.now() + path.extname(file.originalname))
            },
        });
    return multer({storage});
};

module.exports = upload;



