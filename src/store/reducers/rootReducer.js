import authReducer from "./authReducer";
import profileReducer from "./profileReducer";
import jobAdReducer from "./jobAdReducer";
import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  jobAd: jobAdReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer
});

export default rootReducer;

// the key name will be the data property on the state object
