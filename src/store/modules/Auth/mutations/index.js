export const beginSignIn = ( state ) => {
    state.signIn.isLoading = true
}

export const successSignIn = ( state, payload ) => {
    state.userDetails.isSignIn = true
    state.signIn.isLoading = false
    state.signIn.isError = false
    state.signIn.data = payload
}

export const failSignIn = ( state, payload ) => {
    state.userDetails.isSignIn = false
    state.signIn.isLoading = false
    state.signIn.isError = true
    state.signIn.errorMessage = payload
}

export const beginRequestUser = ( state ) => {
    state.userDetails.isLoading = true
}

export const successRequestUser = ( state, payload ) => {
    state.userDetails.isSignIn = true
    state.userDetails.isLoading = false
    state.userDetails.isError = false
    state.userDetails.userData = payload
}

export const failRequestUser = ( state, payload ) => {
    state.userDetails.isSignIn = false
    state.userDetails.isLoading = false
    state.userDetails.isError = true
    state.userDetails.errorMessage = payload
}

export const successLogOut = ( state ) => {
    state.userDetails.isSignIn = false
    state.userDetails.userData = []
}

export const failLogOut = ( state, payload ) => {
    state.userDetails.isSignIn = true
    state.userDetails.isError = true
    state.userDetails.errorMessage = payload
}
