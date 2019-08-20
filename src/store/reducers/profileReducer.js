const initState = {};

const profileReducer = (state = initState, action) => {
  switch (action.type) {
    case "UPDATE_JOBSEEKER_PROFILE_SUCCESS":
      console.log("update jobseeker profile success");
      return {
        ...state,
        response: "success",
        message: "Profile successfully updated."
      };
    case "UPDATE_JOBSEEKER_PROFILE_ERROR":
      console.log("update jobseeker profile error");
      return {
        ...state,
        response: "danger",
        message: "An error occured!"
      };
    case "UPDATE_EMPLOYER_PROFILE_SUCCESS":
      console.log("update employer profile success");
      return {
        ...state,
        response: "success",
        message: "Profile successfully updated."
      };
    case "UPDATE_EMPLOYER_PROFILE_ERROR":
      console.log("update employer profile error");
      return {
        ...state,
        response: "danger",
        message: "An error occured!"
      };
    //@begin Change Password - Abel
    case "PWCHANGE_SUCCESS":
      console.log("Password Change - success");
      return {
        ...state,
        authStatus: "OK",
        authMsg: "Password successfully changed."
      };
    case "PWCHANGE_ERROR":
      console.log("Password Change - error");
      return {
        ...state,
        authStatus: "ERROR",
        authMsg: action.err.message
      };
    //@end Change Password - Abel
    default:
      return state;
  }
};

export default profileReducer;
