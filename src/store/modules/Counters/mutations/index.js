export const incrementCountMutation = ( state, counterName ) => {

    if (counterName){
        state[counterName]++
    }else{
        state.default++
    }
}
