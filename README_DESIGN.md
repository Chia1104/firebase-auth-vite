# Firebase Auth for Vite

run-pix.web.app

This project was created with [Vite](https://vitejs.dev/).

This is a simple app using Firebase Auth to authenticate users, and using Vuex to manage state.

You can see the full application at [vue-ts-firebase-example](https://github.com/Chia1104/vue-ts-firebase-example)

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
        * status: "hidden", none=>active
    * startlist [bib,distance,category,name]
    * readings: 
        * [bib,waypoint,timing,gps]
    * results: 
        * [bib,dns/dnf/status,timing, [splits]]

## Modes

      timestamp
      bib: bibStr,
      userId: userId,
      waypoint: 
      // latlng: 
      imagePath: fileName,
      score

* text capture with distance
    _waypoint 5,10_   need text
* text capture without 
    _waypoint_ need text
* img capture with distance
    _waypoint 5,10_   
    * with extra bibs  additional bibs
    * will no bibs  * upload with UNKNOWN
* img capture without distance

* upload with exif date
* selfie upload
