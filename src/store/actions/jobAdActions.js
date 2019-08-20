import _ from "lodash";
const boyerMoore = require("../actions/Boyer-Moore").boyerMooreSearch;

export const jobAdActions = jobAd => {
  return (dispatch, getState, { getFirestore }) => {
    // make async call to database
    const userId = getState().firebase.auth.uid;
    const firestore = getFirestore();
    console.log(jobAd);
    firestore
      .collection("employer")
      .doc(userId)
      .get()
      .then(d => {
        const employername = d.data().employerName ? d.data().employerName : "";
        const employeremail = d.data().contactEmail
          ? d.data().contactEmail
          : d.data().employerEmail;
        firestore
          .collection("jobposting")
          .add({
            ...jobAd,
            employerid: userId,
            employername: employername,
            employeremail: employeremail ? employeremail : "",
            createdAt: new Date(),
            lastUpdatedAt: new Date()
          })
          .then(() => {
            dispatch({ type: "CREATE_JOBPOST_SUCCESS" });
          })
          .catch(err => {
            dispatch({ type: "CREATE_JOBPOST_ERROR" }, err);
          });
      })
      .catch(err => {
        dispatch({ type: "CREATE_JOBPOST_ERROR" }, err);
      });
  };
};

export const jobUpdateActions = (jobAdId, jobAd) => {
  return (dispatch, getState, { getFirestore }) => {
    // make async call to database
    const userId = getState().firebase.auth.uid;
    const firestore = getFirestore();
    //const jobAdId = jobAd.id;

    firestore
      .collection("employer")
      .doc(userId)
      .get()
      .then(d => {
        const employername = d.data().employerName ? d.data().employerName : "";
        const employeremail = d.data().contactEmail
          ? d.data().contactEmail
          : d.data().employerEmail;
        //delete jobAd.id;

        firestore
          .collection("jobposting")
          .doc(jobAdId)
          .update({
            ...jobAd,
            employerid: userId,
            employername: employername,
            employeremail: employeremail ? employeremail : "",
            lastUpdatedAt: new Date()
          })
          .then(() => {
            dispatch({ type: "UPDATE_JOBPOST_SUCCESS" });
          })
          .catch(err => {
            dispatch({ type: "UPDATE_JOBPOST_ERROR" }, err);
          });
      })
      .catch(err => {
        dispatch({ type: "UPDATE_JOBPOST_ERROR" }, err);
      });
  };
};

export const jobDeleteActions = jobAdId => {
  return (dispatch, getState, { getFirestore }) => {
    // make async call to database
    const firestore = getFirestore();

    firestore
      .collection("jobposting")
      .doc(jobAdId)
      .delete()
      .then(() => {
        dispatch({ type: "DELETE_JOBPOST_SUCCESS" });
      })
      .catch(err => {
        dispatch({ type: "DELETE_JOBPOST_ERROR" }, err);
      });
  };
};

// jobseeeker choice Saving-
export const saveUserChoice = choice => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    // a new document is created, no need to update since user won't see jobAd again:
    firestore
      .collection("jobSeekerChoice")
      .add({
        ...choice,
        createdAt: new Date()
      })
      .then(() => {
        if (choice.isLiked) {
          dispatch(matchJobSeekerLikeWithEmployerChoice(choice));
        } //if jobseeker likes the jobAd, a new match should be verified.
        dispatch({ type: "SAVE_JOB_SEEKER_CHOICE_SUCCESS" });
      })
      .catch(err => {
        dispatch({ type: "SAVE_JOB_SEEKER_CHOICE_ERROR" }, err);
      });
  };
};

export const matchJobSeekerLikeWithEmployerChoice = choice => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const matchEntity = {
      jobAdId: null,
      jobSeekerId: null,
      employerID: null
    };
    const firestore = getFirestore();

    //search if company also likes this jobseeker and for the same jobAd
    firestore
      .collection("employerChoice")
      .where("jobSeekerId", "==", choice.jobSeekerId) //company likes jobSeeker
      .where("jobAdId", "==", choice.jobAdId) //for the same JobAd
      .where("isLiked", "==", true) //company likes (true) and not dislikes
      .get()
      .then(function(querySnapshot) {
        //if company also likes jobseeker for the same jobAd, a new match is arises <3
        querySnapshot.forEach(function(userSnapshot) {
          //  create document with match:
          var match = matchEntity;
          match.jobAdId = choice.jobAdId;
          match.jobSeekerId = choice.jobSeekerId;
          match.employerID = userSnapshot.data().employerId;
          match.employerEmail = userSnapshot.data().employerEmail
            ? userSnapshot.data().employerEmail
            : "";

          //we save this relationship in DB, collection: match
          firestore
            .collection("match")
            .add({
              ...match,
              createdAt: new Date()
            })
            .then(() => {
              dispatch({ type: "SAVE_JOB_SEEKER_MATCH_SUCCESS" }); /////////////////////////
            })
            .catch(err => {
              dispatch({ type: "SAVE_JOBSEEKER_MATCH_ERROR" }, err); ////////////////////////
            });
        });
      })
      .catch(function(error) {
        dispatch({ type: "SAVE_JOBSEEKER_MATCH_ERROR" }, error); ////////////////////////
      });
  };
};
// jobseeeker choice Saving-

// saveEmployerChoice
export const saveEmployerChoice = employerChoice => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    firestore
      .collection("employerChoice")
      .add({
        ...employerChoice,
        createdAt: new Date()
      })
      .then(() => {
        if (employerChoice.isLiked) {
          dispatch(matchEmployerLikeWithJobSeekerChoice(employerChoice));
        } //if jobseeker likes the jobAd, a new match should be verified.
        dispatch({ type: "SAVE_EMPLOYER_CHOICE_SUCCESS" });
      })
      .catch(err => {
        dispatch({ type: "SAVE_EMPLOYER_CHOICE_ERROR" }, err);
      });
  };
};

export const matchEmployerLikeWithJobSeekerChoice = employerChoice => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const matchEntity = {
      jobAdId: null,
      jobSeekerId: null,
      employerID: null
    };
    const firestore = getFirestore();
    //search if jobseeker also likes this same jobAd
    firestore
      .collection("jobSeekerChoice")
      .where("jobSeekerId", "==", employerChoice.jobSeekerId) //company likes jobSeeker
      .where("jobAdId", "==", employerChoice.jobAdId) //for the same JobAd
      .where("isLiked", "==", true) //company likes (true) and not dislikes
      .get()
      .then(function(querySnapshot) {
        //if jobseeker also likes this same jobAd, a new match is arises <3
        querySnapshot.forEach(function(userSnapshot) {
          //  create document with match:
          var match = matchEntity;
          match.jobAdId = employerChoice.jobAdId;
          match.jobSeekerId = employerChoice.jobSeekerId;
          match.employerID = getState().firebase.auth.uid;
          match.employerEmail = userSnapshot.data().employerEmail
            ? userSnapshot.data().employerEmail
            : "";

          //we save this relationship in DB, collection: match
          firestore
            .collection("match")
            .add({
              ...match,
              createdAt: new Date()
            })
            .then(() => {
              dispatch({ type: "SAVE_EMPLOYER_MATCH_SUCCESS" }); /////////////////////////
            })
            .catch(err => {
              dispatch({ type: "SAVE_EMPLOYER_MATCH_ERROR" }, err); ////////////////////////
            });
        });
      })
      .catch(function(error) {
        dispatch({ type: "SAVE_EMPLOYER_MATCH_ERROR" }, error); ////////////////////////
      });
  };
};
export const getjobposting = () => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const today = new Date(Date.now());

    firestore
      .collection("jobposting")
      .where("expirationdate", ">=", today)
      .get()
      .then(function(querySnapshot) {
        firestore
          .collection("jobseeker")
          .doc(getState().firebase.auth.uid)
          .get()
          .then(function(doc) {
            if (doc.exists) {
              var data = [];
              querySnapshot.forEach(function(documentSnapshot) {
                const unexpiredJobPosting = documentSnapshot.data();
                unexpiredJobPosting.id = documentSnapshot.id;
                const userSkills = doc.data().skills;
                const neededskills = unexpiredJobPosting.neededskills;
                const userLanguages = doc.data().languages;
                const neededLanguages = unexpiredJobPosting.languages;

                const matchedSkills = _.intersectionWith(
                  neededskills,
                  userSkills,
                  function(neededskill, userSkill) {
                    return boyerMoore(
                      neededskill.label.toLowerCase(),
                      userSkill.label.toLowerCase()
                    ); // string pattern matching using Boyer–Moore string-search algorithm
                  }
                );

                const matchedLanguages = _.intersectionWith(
                  userLanguages,
                  neededLanguages,
                  function(neededLanguage, userLanguage) {
                    return (
                      neededLanguage.label.toLowerCase() ===
                      userLanguage.label.toLowerCase()
                    );
                  }
                );
                if (matchedSkills.length > 0 || matchedLanguages.length > 0) {
                  data.push(unexpiredJobPosting);
                  return unexpiredJobPosting;
                }
              });
              dispatch({ type: "FETCH_JOB_POST_SUCCESS", data });
            }
          });
      })
      .catch(function(error) {
        dispatch({ type: "FETCH_JOB_POST_ERROR" }, error); ////////////////////////
      });
  };
};

export const getjobseekers = jobAdId => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    firestore
      .collection("jobseeker")
      .get()
      .then(function(querySnapshot) {
        firestore
          .collection("jobposting")
          .doc(jobAdId)
          .get()
          .then(function(doc) {
            if (doc.exists) {
              var data = [];
              querySnapshot.forEach(function(documentSnapshot) {
                const jobSekeersList = documentSnapshot.data();
                jobSekeersList.id = documentSnapshot.id;
                const neededskills = doc.data().neededskills;
                const userSkills = jobSekeersList.skills;

                const neededLanguages = doc.data().languages;
                const userLanguages = jobSekeersList.languages;

                const matchedSkills = _.intersectionWith(
                  userSkills,
                  neededskills,
                  function(userSkill, neededskill) {
                    return boyerMoore(
                      userSkill.label.toLowerCase(),
                      neededskill.label.toLowerCase()
                    ); // string pattern matching using Boyer–Moore string-search algorithm
                  }
                );

                const matchedLanguages = _.intersectionWith(
                  neededLanguages,
                  userLanguages,
                  function(userLanguage, neededLanguage) {
                    return (
                      userLanguage.label.toLowerCase() ===
                      neededLanguage.label.toLowerCase()
                    );
                  }
                );
                if (matchedSkills.length > 0 || matchedLanguages.length > 0) {
                  data.push(jobSekeersList);
                  return jobSekeersList;
                }
              });
              dispatch({ type: "FETCH_JOB_SEEKER_SUCCESS", data });
            }
          });
      })
      .catch(function(error) {
        dispatch({ type: "FETCH_JOB_SEEKER_ERROR" }, error); ////////////////////////
      });
  };
};
