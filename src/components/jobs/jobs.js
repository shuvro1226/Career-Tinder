import React from "react";
import * as ROUTES from "../../constants/routes";
import { connect } from "react-redux";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import JobsList from ".//jobsList";
import JobAds from "./jobAds";
import { firestoreConnect } from "react-redux-firebase";
import swal from "sweetalert";

class Jobs extends React.Component {
  constructor(props) {
    super(props);
    this.redirectToProfile = this.redirectToProfile.bind(this);
    this.getProfileCompletionPercentage = this.getProfileCompletionPercentage.bind(
      this
    );
    this.checkProperties = this.checkProperties.bind(this);
  }

  getProfileCompletionPercentage = user => {
    const percentOf = Object.keys(user).length;
    const percentFor = this.checkProperties(user);
    return Math.floor((percentFor / percentOf) * 100);
  };

  checkProperties(obj) {
    var doneCount = 0;
    for (var key in obj) {
      if (obj[key] !== null && obj[key] !== "" && obj[key]) doneCount++;
    }
    return doneCount;
  }

  redirectToProfile = (percentage, role) => {
    if (sessionStorage.getItem("popupLoaded") !== "1") {
      swal({
        text:
          "As " +
          role +
          " you need at least " +
          percentage +
          "% of your profile completed in order to get benefitted in full from Career Tinder app. Do you want to complete your profile now?",
        icon: "warning",
        buttons: true,
        dangerMode: false
      }).then(goToProfile => {
        if (goToProfile) {
          this.props.history.push(ROUTES.UPDATE_PROFILE);
        }
      });
    }
    sessionStorage.setItem("popupLoaded", "1");
  };

  render() {
    const { auth, user, jobAds } = this.props;
    var filteredJobAds =
      jobAds && jobAds.filter(jobpost => jobpost.employerid === auth.uid);
    if (!auth.uid && !auth.emailVerified)
      return <Redirect to={ROUTES.LOG_IN} />;
    if (
      user &&
      user.userType === "jobseeker" &&
      user.profileCompletenessPercentage < 85
    ) {
      this.redirectToProfile(85, "Job Seeker");
    }
    if (
      user &&
      user.userType === "employer" &&
      user.profileCompletenessPercentage < 80
    ) {
      this.redirectToProfile(80, "Employer");
    }
    return (
      <div className="container">
        {user && user.userType === "jobseeker" ? (
          <JobAds />
        ) : (
          <JobsList jobs={filteredJobAds} />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const auth = state.firebase.auth;
  let jobseekers = state.firestore.data.jobseeker;
  let jobseeker = jobseekers ? jobseekers[auth.uid] : null;
  let employers = state.firestore.data.employer;
  let employer = employers ? employers[auth.uid] : null;
  return {
    user: state.firebase.profile,
    auth: auth,
    uid: auth.uid,
    jobseeker: jobseeker,
    employer: employer,
    jobAds: state.firestore.ordered.jobposting
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    {
      collection: "jobposting",
      orderBy: ["createdAt", "desc"]
    },
    {
      collection: "jobseeker"
    },
    {
      collection: "employer"
    }
  ])
)(Jobs);
