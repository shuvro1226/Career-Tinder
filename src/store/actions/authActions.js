export const signIn = credentials => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase
      .auth()
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(() => {
        const user = firebase.auth().currentUser;
        user.reload().then(() => {
          if (user) {
            if (user.emailVerified) {
              dispatch({ type: "LOGIN_SUCCESS" });
            } else {
              dispatch(verifyEmail());
              dispatch({ type: "EMAIL_NOT_VERIFIED" });
            }
          }
        });
      })
      .catch(err => {
        dispatch({ type: "LOGIN_ERROR", err });
      });
  };
};
export const signOut = () => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch({ type: "SIGNOUT_SUCCESS" });
      });
    firebase.logout();
  };
};

export const signUpAsJobSeeker = newUser => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    const batch = firestore.batch();

    firebase
      .auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password)
      .then(resp => {
        var newUserType = firestore.collection("users").doc(resp.user.uid);
        batch.set(newUserType, {
          userType: "jobseeker",
          email: newUser.email,
          profileCompletenessPercentage: 0
        });
        var jobSeeker = firestore.collection("jobseeker").doc(resp.user.uid);

        batch.set(jobSeeker, {
          jobSeekerName: newUser.fullName,
          jobSeekerEmail: newUser.email
        });

        resp.user.updateProfile({
          displayName: newUser.fullName
        });
        dispatch(verifyEmail());

        batch.commit();
      })
      .then(() => {
        dispatch({ type: "SIGNUP_SUCCESS" });
      })
      .catch(err => {
        dispatch({ type: "SIGNUP_ERROR", err });
      });
  };
};

export const signUpAsEmployer = newUser => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    const batch = firestore.batch();

    firebase
      .auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password)
      .then(resp => {
        var newUserType = firestore.collection("users").doc(resp.user.uid);
        batch.set(newUserType, {
          userType: "employer",
          email: newUser.email,
          profileCompletenessPercentage: 0
        });
        var employer = firestore.collection("employer").doc(resp.user.uid);
        batch.set(employer, {
          employerName: newUser.companyname,
          employerEmail: newUser.email
        });

        resp.user.updateProfile({
          displayName: newUser.companyname
        });
        dispatch(verifyEmail());

        batch.commit();
      })
      .then(() => {
        dispatch({ type: "SIGNUP_SUCCESS" });
      })
      .catch(err => {
        dispatch({ type: "SIGNUP_ERROR", err });
      });
  };
};
export const verifyEmail = () => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    //const firestore = getFirestore();
    var user = firebase.auth().currentUser;
    if (user) {
      firebase
        .auth()
        .currentUser.sendEmailVerification({
          // url: ROUTES.EMAIL_REDIRECT_URL_DEV
        })
        .then(() => {
          dispatch(signOut());
          dispatch({ type: "EMAIL_SENT_SUCCESS" });
        })
        .catch(err => {
          dispatch({ type: "EMAIL_SENT_ERROR", err });
        });
    }
  };
};
//@begin: Password Reset (Forget) - Abel G.
export const passwordForget = email => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    //const firestore = getFirestore();

    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        // this.setState({ ...INITIAL_STATE });
        dispatch({ type: "PWFORGET_SUCCESS" });
      })
      .catch(err => {
        //      this.setState({ error });
        dispatch({ type: "PWFORGET_ERROR", err });
      });
  };
};
//@end: Password Reset (Forget) - Abel G.
