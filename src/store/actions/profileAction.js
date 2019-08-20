export const editJobSeekerProfile = jobseeker => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const authorId = getState().firebase.auth.uid;

    const batch = firestore.batch();

    var jobseekerDoc = firestore.collection("jobseeker").doc(authorId);
    batch.set(
      jobseekerDoc,
      {
        ...jobseeker,
        lastUpdateAt: new Date()
      },
      { merge: true }
    );

    var userId = firestore.collection("users").doc(authorId);
    batch.update(userId, {
      profileCompletenessPercentage: getProfileCompletenessPercentage(jobseeker)
    });

    batch
      .commit()
      .then(() => {
        dispatch({ type: "UPDATE_JOBSEEKER_PROFILE_SUCCESS" });
      })
      .catch(err => {
        dispatch({ type: "UPDATE_JOBSEEKER_PROFILE_ERROR" }, err);
      });
  };
};

export const editEmployerProfile = employer => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const authorId = getState().firebase.auth.uid;
    const batch = firestore.batch();

    var employerDoc = firestore.collection("employer").doc(authorId);
    batch.set(
      employerDoc,
      {
        ...employer,
        lastUpdateAt: new Date()
      },
      { merge: true }
    );

    var userId = firestore.collection("users").doc(authorId);
    batch.update(userId, {
      profileCompletenessPercentage: getProfileCompletenessPercentage(employer)
    });

    batch
      .commit()
      .then(() => {
        dispatch({ type: "UPDATE_EMPLOYER_PROFILE_SUCCESS" });
      })
      .catch(err => {
        dispatch({ type: "UPDATE_EMPLOYER_PROFILE_ERROR", err });
      });
  };
};

//@begin: Password Change - Abel G.
export const passwordChange = newPassword => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    //const firestore = getFirestore();

    firebase
      .auth()
      .currentUser.updatePassword(newPassword)
      .then(() => {
        dispatch({ type: "PWCHANGE_SUCCESS" });
      })
      .catch(err => {
        dispatch({ type: "PWCHANGE_ERROR", err });
      });
  };
};
//@end: PasswordChange - Abel G.

//percentage Calculation
function getProfileCompletenessPercentage(employer) {
  const percentOf = Object.keys(employer).length;
  const percentFor = checkProperties(employer);
  return Math.floor((percentFor / percentOf) * 100);
}
function checkProperties(obj) {
  var doneCount = 0;
  for (var key in obj) {
    if (obj[key] !== null && obj[key] !== "") doneCount++;
  }
  return doneCount;
} //percentage Calculation
