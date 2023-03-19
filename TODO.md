# TODO : Design

## user case
* find timing from images
* for images for a bib

## Reference

### Attributes
* Races
    * Date: ISODate
    * Location,
    * Name,
    * Course: [5k,10k]
    * Waypoints: [venue,general,start,end,5k,10k]   # Waypoints can be common to both routes
                                    # venue, general skipped for timing
    * photoStatus: [published]
    * raceStatus: [open|closed|archived] # used for timing


### Hierarchy
* Event/Race : My Choice  
    * Course/Distance : 10k
        * WPT : START,END
    * Bib

photos: Event, WPT

### Paths
 NOTE
 location to be inserted
 email @ replaced by $

* Storage: /uploads/race/time~wpt~user~loc~file    # uploaded images
    * no time means only bib tagging, no timing processing

* Storage: /processed/race/time~wpt~user~loc~file     # processed images 

* Storage: /thumbs/race/time~wpt~user~loc~file     # processed thumbnails 
* Firestore: races/:raceid/
    * doc: [raceId,RD,location,date, status, start time, waypoints, bib pattern]
    * images/time~wpt~user~loc~file   # Text annotations
    * startlist [bib,distance,category,name]
    * readings: 
        * [bib,waypoint,timing,gps]
    * results: 
        * [bib,dns/dnf/status,timing, [splits]]

## Todo:
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