const multer = require("multer");
const { storage } = require("./my-gridfs-service");

const upload = multer({
    storage
});

module.exports = function GridFSMiddleware() {
    return upload.single("pdf");
};