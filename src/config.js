var config = {};

// config = {};
config.storage = {};
config.api = {};
config.face = {};
config.images = {};

config.face.minDistx100 = 40
config.images.limit_pics = 5000

config.storage.uploads =  "uploads"
config.storage.faceUploads =  "faceuploads"

config.api.faceMatchUpload =  "https://runpix-face-nqmxzlpvyq-uc.a.run.app" //"http://localhost:8080"//
                            
//= process.env.WEB_PORT || 9980;

// module.exports = config;
export {config}