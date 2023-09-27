# Cloud Run Image Processing 


API for
    - scanFace_image (gs:path)
        reads 1 storage image
        get face id
        update faces in firestore
    - MatchFace Image in Directory (blob, gs:dir, distance threshold)
        get face id
        match other faces in the folders (firebase list all)
        - future add new photo to catalog)
    - scanFaces directory
        read directory
        call scanFace_image





Ref (https://github.com/GoogleCloudPlatform/nodejs-docs-samples/tree/main/run).

## Dependencies

* **express**: Web server framework
* **[gm](https://github.com/aheckmann/gm#readme)**: ImageMagick integration library.
* **@google-cloud/storage**: Google Cloud Storage client library.
* **@google-cloud/vision**: Cloud Vision API client library.

## Environment Variables

Development:


test
set GOOGLE_APPLICATION_CREDENTIALS=c:\i\auth\run-pix-092258e3cb1b.json
node index.js
localhost:8080/?bucket=run-pix.appspot.com&name=file

https://console.firebase.google.com/u/0/project/run-pix/storage/run-pix.appspot.com/files


Cloud Run services can be [configured with Environment Variables](https://cloud.google.com/run/docs/configuring/environment-variables).
Required variables for this sample include:

* `INPUT_BUCKET_NAME`: The Cloud Run service will be notified of images uploaded to this Cloud Storage bucket. The service will then retrieve and process the image.
* `BLURRED_BUCKET_NAME`: The Cloud Run service will write blurred images to this Cloud Storage bucket.

## Maintenance Note


