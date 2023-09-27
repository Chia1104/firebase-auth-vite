var config = {};

// config = {};
config.storage = {};
config.api = {};

config.storage.uploads =  "uploads"
config.storage.faceUploads =  "faceuploads"

config.api.faceMatchUpload =  "http://localhost:8080"//"https://runpix-face-nqmxzlpvyq-uc.a.run.app" //
//= process.env.WEB_PORT || 9980;

// module.exports = config;
export {config}