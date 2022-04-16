export const authInitState = {
  signIn: {
    isLoading: false,
    isError: false,
    errorMessage: '',
    data: [],
  },
  userDetails: {
    isSignIn: false,
    isLoading: false,
    isError: false,
    errorMessage: '',
    userData: {
      displayName: '',
      email: '',
      photoURL: '',
      uid: '',
      emailVerified: false,
    },
  },
  register: {
    isLoading: false,
    isError: false,
    errorMessage: '',
    data: [],
  },
};
