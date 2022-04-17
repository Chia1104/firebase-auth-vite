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
    userData: [],
  },
  register: {
    isLoading: false,
    isError: false,
    errorMessage: '',
    data: [],
  },
  changePassword: {
    isLoading: false,
    isError: false,
    isSuccess: false,
    errorMessage: '',
  },
};
