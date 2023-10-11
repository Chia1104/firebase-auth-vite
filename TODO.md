# TODO : Design

## use case
* find timing from images
* for images for a bib
 
# Todo:

* result publishing

arrayOfMins=_.chain(allEntries.value).filter(checkStatus).filter(checkBib).groupBy("bib").map((x,k)=>_.minBy(x,"timestamp")).value() 

keys_=_.words("bib name timestamp status waypoint gender ")
res=_.chain(allEntries.value).filter(checkBib).groupBy("bib").map((x,k)=>_.chain(x).minBy("timestamp").pick(keys_).value()).orderBy("timestamp").groupBy(x=>x.status+"-"+x.waypoint+'-'+x.gender).value()

* video capture
* user permissions
* timestamp update
* startlist screen
* photoStatus==available UI 
* timestamp from server
* Logic to add timing entry: need lot of work
* watch the queue traffic
* search for all images (in case of seach image has all face. current solution any faces)


### current 
* rename API as /image as /api/facematch

* defect: merge two fields 'user' for start else 'userId'
* Event mgt UI finetuning
* backend changes
    * change image waypoint
* Start list
* SVG logos
    * event logos

### features
* **28sep**
    * face search
        * service that wakes up for performance
        * direct fetch (earlier option storage update->pubsub->eventarc->function)
        * find more images button (maxDist)
        * compress images before upload
        * progress bar
        * test scripts
        * racelist sorted
        * photoStatus to have: available, face, faceonly
        * JOB API: getdescriptors /api/eventscan
        * JOB API: cluster /api/eventcluster   
    * revamped race page race create me
        * cards vs data table
        * create new race button
        * races sorted desc
* **14May**
    * several WIP change for race management
    * function generated page has ext .png.jpg instead of .jpg
    * share url working now

* **24 Apr**
    * reading marked with text
    * race log / provisional changes
    * bib lookup 
    * timestamp from photo internal

* **18 Apr**
    * publish results
* **9 Apr**
    * race start stop
    * UI: edit race info
    * UI: Camera / zoom
* **1 Apr**
    * search by bib no or name
    * direct link to bib
    * dynamic page with OG tags
    * upload time bookmark
* **Mar 2023**
    * IMG: dynamic resize (backend)
    * Default watermark (blank)
    * two rows fixed/centerd
    * SC: FB share
    * Whatsapp share

### bugs
### roadmap
* highlight pictures for the race
* IMG: watermark
* SS: INSTA share
* separate upload bucket - low

* user profiles
* UI: Org/roles
* UI: Race results

* finisher certificate
* certificates https://www.npmjs.com/package/google-slides
* certificate pdf to PNG https://www.npmjs.com/package/pdf-to-png-converter

* online registration

* Shopping cart

* Azure porting face matching
###
* Functions
    * Upload
        * bucket selection

    * Image to JSON
        testing framework
        all text labels
    * Json to reading
        * match to regex pattern of bib (and partial matches too)
        * score confidence (height/picture_height)
            * img, date, text, score
        * entry  in the reading table
    * tiing selections

* Bulk upload
    * files by location


`<FileUpload name="demo[]" :customUpload="true" @uploader="myUploader" />`

* race coverage
 if all bibs are covered?