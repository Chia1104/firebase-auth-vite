export const getRacesMutation = ( state, payload ) => {
    state.races = payload;

    state.racesObj = payload.reduce( (a,x) =>{
        a[x.id] = x
        return a
    },{})
}
