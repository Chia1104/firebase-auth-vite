export const beginUserRequest = ( state ) => {
    state.user.isLoading = true
}

export const successUserRequest = ( state, payload ) => {
    state.user.isLoading = false
    state.user.isError = false
    state.user.data = payload
}

export const failUserRequest = ( state, payload ) => {
    state.user.isLoading = false
    state.user.isError = true
    state.user.errorMessage = payload
}
