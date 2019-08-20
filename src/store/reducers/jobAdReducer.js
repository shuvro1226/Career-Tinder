const initState = {};

const jobAdReducer = (state = initState, action) => {
  const { data } = action;

  switch (action.type) {
    case "CREATE_JOBPOST_SUCCESS":
      console.log("CREATE_JOBPOST_SUCCESS");
      return {
        ...state,
        response: "success",
        message: "Job opportunity has been created successfully."
      };
    case "CREATE_JOBPOST_ERROR":
      console.log("CREATE_JOBPOST_ERROR");
      return {
        ...state,
        response: "danger",
        message: "An error occured!"
      };
    case "UPDATE_JOBPOST_SUCCESS":
      console.log("UPDATE_JOBPOST_SUCCESS");
      return {
        ...state,
        response: "success",
        message: "Job opportunity has been updated successfully."
      };
    case "UPDATE_JOBPOST_ERROR":
      console.log("UPDATE_JOBPOST_ERROR");
      return {
        ...state,
        response: "danger",
        message: "An error occured!"
      };
    case "DELETE_JOBPOST_SUCCESS":
      console.log("DELETE_JOBPOST_SUCCESS");
      return {
        ...state,
        response: "success",
        message: "Job opportunity has been deleted successfully."
      };
    case "DELETE_JOBPOST_ERROR":
      console.log("DELETE_JOBPOST_ERROR");
      return {
        ...state,
        response: "danger",
        message: "An error occured!"
      };
    case "SAVE_JOB_SEEKER_CHOICE_SUCCESS":
      console.log("SAVE_JOB_SEEKER_CHOICE_SUCCESS");
      return {
        ...state,
        response: "success",
        message: "Your choice has been successfully saved."
      };
    case "SAVE_JOB_SEEKER_CHOICE_ERROR":
      console.log("SAVE_JOB_SEEKER_CHOICE_ERROR");
      return {
        ...state,
        response: "danger",
        message: "An error occured!"
      };
    case "SAVE_EMPLOYER_CHOICE_ERROR":
      console.log("SAVE_EMPLOYER_CHOICE_ERROR");
      return {
        ...state,
        response: "danger",
        message: "An error occured!"
      };
    case "SAVE_JOB_SEEKER_MATCH_SUCCESS":
      console.log("SAVE_JOB_SEEKER_MATCH_SUCCESS");
      return {
        ...state,
        response: "success",
        message: "Your match has been successfully saved."
      };
    case "SAVE_EMPLOYER_MATCH_SUCCESS":
      console.log("SAVE_EMPLOYER_MATCH_SUCCESS");
      return {
        ...state,
        response: "success",
        message: "Your match has been successfully saved."
      };
    case "SAVE_JOBSEEKER_MATCH_ERROR":
      console.log("SAVE_JOBSEEKER_MATCH_ERROR");
      return {
        ...state,
        response: "danger",
        message: "An error occured!"
      };
    case "SAVE_EMPLOYER_MATCH_ERROR":
      console.log("SAVE_EMPLOYER_MATCH_ERROR");
      return {
        ...state,
        response: "danger",
        message: "An error occured!"
      };
    case "FETCH_JOB_POST_SUCCESS":
      console.log("FETCH_JOB_POST_SUCCESS");
      return {
        ...state,
        response: "success",
        message: "Job post has been fetched successfully",
        data
      };
    case "FETCH_JOB_POST_ERROR":
      console.log("FETCH_JOB_POST_ERROR");
      return {
        ...state,
        response: "danger",
        message: "An error occured!"
      };
    case "FETCH_JOB_SEEKER_SUCCESS":
      console.log("FETCH_JOB_SEEKER_SUCCESS");
      return {
        ...state,
        response: "success",
        message: "Job seeker list has been fetched successfully",
        data
      };
    case "FETCH_JOB_SEEKER_ERROR":
      console.log("FETCH_JOB_SEEKER_ERROR");
      return {
        ...state,
        response: "danger",
        message: "An error occured!"
      };
    default:
      return state;
  }
};

export default jobAdReducer;
