const fs = require("fs");

const moveUploadedFile = (sourcePath, destinationPath, flags) => {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(sourcePath);
        const writeStream = fs.createWriteStream(destinationPath, { flags });
        readStream.on("error", reject);
        writeStream.on("error", reject);
        writeStream.on("finish", resolve);
        readStream.pipe(writeStream);
    });
}

module.exports = {
    moveUploadedFile
}