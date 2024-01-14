import {
    getRaces, getDocData
 } from "../api"; 
 
const getRacesAction = async (context) => {
 //    context.commit("beginRequestUser");
    try {
        const response = await getRaces();
        if (response) context.commit("getRacesMutation", response);
     //    else context.commit("failRequestUser", 'Could not complete request!!');
    } catch (error) {
     //    context.commit("failRequestUser", error);
         console.error("Failed getting errors",error)
    }
 };

 const getRaceObjAction = async (context, raceId) => {
    //    context.commit("beginRequestUser");
       if (!raceId || (context.state.raceId==raceId)){
            console.log(`getRaceObjAction skipped for ${raceId}`)
            return // wuthout results
        }
       try {
           const response = await getDocData(`/races/${raceId}`);
           if (response) context.commit("getRaceObjMutation", {raceId,response});

       } catch (error) {
            console.error("Failed getting errors",error)
       }
    };
 

const getRacesMutation = ( state, payload ) => {
    state.races = payload;
    state.racesObj = payload.reduce( (a,x) =>{
        a[x.id] = x
        return a
    },{})
}

const getRaceObjMutation = ( state, payload ) => {
    state.raceId = payload.raceId
    state.race = payload.response;
    state.races[payload.raceId] = payload.response
    console.log(`getRaceObjMutation() ${payload.raceId}`)
}

const datastoreInitialState = {
    races : [],
    racesObj: {},
    raceId: null,
    race : {waypoint:'VENUE'},
    gps: {}
};

export const datastore = {
    state: () => datastoreInitialState,
    mutations: { getRacesMutation, getRaceObjMutation },
    actions: { getRacesAction, getRaceObjAction }
}
