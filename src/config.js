var config = {};

// config = {};
config.storage = {};
config.api = {};
config.face = {};
config.images = {};
config.raceMgt = {};

config.raceMgt.ingoredBibStatuses=[null,'','From sheet','From sheet'] 
config.face.minDistx100 = 40
config.images.limit_pics = 5000

config.GS_PREFIX = "https://storage.googleapis.com/run-pix.appspot.com/"
config.storage.uploads =  "uploads"
config.storage.faceUploads =  "faceuploads"

// format usable for data table
config.startListHeaders=[
  { field: "Bib", header: "Bib", sortable: true },
  { field: "Name", header: "Name", sortable: true },
  { field: "Gender", header: "Gender", sortable: true },
  { field: "Category", header: "Category", sortable: true },
  { field: "Distance", header: "Distance", sortable: true },
  { field: "Status", header: "Status", sortable: true },
]

config.raceInfoPanelLabels={
  id:'Id',
  Name: 'Name',
  Location: 'Location',
  Date : {label:'Date',mask:'9999-99-99',placeholder:'YYYY-MM-DD'},
  linkRace: 'Race link',
  linkReg: 'Registration link',
  raceOrg: 'Event Organizer',
  linkOrg: 'Organizer link',
  linkResults: 'Results link',
  linkPhotos: 'Photos link',
  linkFeedback: 'Feedback link',
}

config.api.faceMatchUpload =  "https://runpix-face-nqmxzlpvyq-uc.a.run.app" //"https://express.runpix.forthe.life" //"http://localhost:8080"//



//= process.env.WEB_PORT || 9980;

// module.exports = config;
export {config}