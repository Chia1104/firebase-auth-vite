
export const getDateTime=(datetime) => {
    let date=datetime? new Date(datetime) : new Date()
    return date.toISOString().replace(/[\-:\.]/g,"").split(/[TZ]/g).slice(0,2) 
}
