const reducer = (state: any, action: any) => {
    switch(action.type) {
        case "WEAPONS":
            return {...state, weapons: action.num}
        case "ASHES": 
            return
        case "INCANTS":
            return
        case "SORCS":
            return
        case "SPIRITS":
            return
        case "TALIS": 
            return
        case "SHIELDS":
            return
            default:
              return state;
    }
}

export default reducer;