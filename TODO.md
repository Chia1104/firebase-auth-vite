# TODO : Design

## use case
* find timing from images
* for images for a bib
 
# Todo:

* video capture
* user permissions
* timestamp update
* startlist screen
* photoStatus==available UI 
* timestamp from server
* Logic to add timing entry: need lot of work

### current 
* defect: merge two fields 'user' for start else 'userId'
* Event mgt UI finetuning
* backend changes
    * change image waypoint
* Start list
* SVG logos
    * event logos

### features
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