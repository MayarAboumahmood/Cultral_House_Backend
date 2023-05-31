const multer = require('multer')

const workerPhotoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/data/workers')
    },
    filename: function (req, file, cb) {
        cb(null, req.body.first_name + req.body.last_name + '.png')
    }
})

const workerPhotoUploader = multer({storage: workerPhotoStorage})

module.exports = {
    workerPhotoUploader
}