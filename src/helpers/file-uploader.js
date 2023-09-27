import { storage } from "../../firebase/config"
import {  ref as dbRef, uploadBytes } from "firebase/storage";
import { config } from "../config"
// const UPLOADS_FOLDER = 'uploads';

export async function uploadFile(file, props) {
	
	// track status and upload file
	file.status = 'loading'


	let timestamp = new Date(file.file.lastModified).toISOString()
	let uploadPath = `${config.storage.uploads}/${props.raceId}/${timestamp}~${props.waypoint}~${props.user}~${file.file.name}`

	// console.log(file.file.name);
	let response = await uploadFiletoGCS(uploadPath, file.file);

	// change status to indicate the success of the upload request
	file.status = true;//response.ok

	return response
}

export async function uploadFiletoGCS(uploadPath, file) {
	// Create file metadata including the content type
	/** @type {any} */
	const metadata={
		contentType: file.type,
	};

	const storageRef=dbRef(storage, uploadPath);

	// 'file' comes from the Blob or File API
	return await uploadBytes(storageRef, file, metadata).then((snapshot) => {
		console.log(`Uploaded ${snapshot.ref.fullPath}`,);
		return snapshot.name
		// debugger;
	}).catch(console.error);
}



export function uploadFiles(files, props) {
	// debugger;
	return Promise.all(files.map((file) => uploadFile(file, props)))
}

export default function createUploader(props) {
	return {
		uploadFile: function (file) {
			return uploadFile(file, props)
		},
		uploadFiles: function (files) {
			return uploadFiles(files, props)
		},
	}
}