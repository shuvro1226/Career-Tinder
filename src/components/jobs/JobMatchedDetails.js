import React from "react";
import "../profile/profile.css";
import "../app/app.css";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import * as ROUTES from "../../constants/routes";
import { Redirect } from "react-router-dom";
import ReactMoment from "react-moment";

class JobMatchedDetails extends React.Component {
  render() {
    const { auth, jobAdList, jobAdId } = this.props;
    if (!auth.uid && !auth.emailVerified)
      return <Redirect to={ROUTES.LOG_IN} />;
    if (jobAdList) {
      const jobAd = jobAdList[jobAdId]; // jobAd is an array of 1. We need to take the first object
      // console.log("jobSeeker ",jobSeeker);

      return (
        <div className="container page-wrapper">
          <h3 className="text-center font-weight-bold mt-4">
            <i className="far fa-address-card" /> Job Details
          </h3>
          <hr />
          <div className="row justify-content-center job-details-sections">
            <div className="col-12">
              <h4 className="text-center font-weight-bold">
                {jobAd.jobtitle ? jobAd.jobtitle : ""}
              </h4>
            </div>
            <div className="col-12 text-center">
              <span className="mr-3">
                <i className="fas fa-clock" />{" "}
                {jobAd.applyfulltime ? "Full-time" : ""}
                {jobAd.applyfulltime && jobAd.applypartime ? " / " : ""}
                {jobAd.applypartime ? "Part-time" : ""}
              </span>
              <span>
                <i className="fas fa-map-marker" />{" "}
                {jobAd.location && jobAd.location.length > 0 ? (
                  jobAd.location.map((loc, index) => {
                    return (
                      loc.label +
                      (index + 1 === jobAd.location.length ? "" : " - ")
                    );
                  })
                ) : (
                  <i className="fas fa-ban text-muted" />
                )}
              </span>
            </div>
            <div className="col-md-6 col-12 mt-3">
              <div className="w-100">
                <label className="form-label w-100">Needed Skills: </label>
                {jobAd.neededskills && jobAd.neededskills.length > 0 ? (
                  jobAd.neededskills.map(skill => {
                    return (
                      <span
                        key={jobAd.id + "_" + skill.value}
                        className="badge badge-warning mr-2"
                      >
                        {skill.label}
                      </span>
                    );
                  })
                ) : (
                  <i className="fas fa-ban text-muted" />
                )}
              </div>
              <div className="w-100">
                <label className="form-label w-100">Education: </label>
                {jobAd.education && jobAd.education.label ? (
                  jobAd.education.label
                ) : (
                  <i className="fas fa-ban text-muted" />
                )}
              </div>
              <div className="w-100">
                <label className="form-label w-100">Required Languages: </label>
                {jobAd.languages && jobAd.languages.length > 0 ? (
                  jobAd.languages.map(lang => {
                    return (
                      <span
                        key={lang.value}
                        className="badge badge-warning mr-2"
                      >
                        {lang.label}
                      </span>
                    );
                  })
                ) : (
                  <i className="fas fa-ban text-muted" />
                )}
              </div>
              <div className="w-100">
                <label className="form-label w-100">
                  Salary Range(Yearly):{" "}
                </label>
                <i className="fas fa-euro-sign" />
                {jobAd.minsalary ? (
                  jobAd.minsalary
                ) : (
                  <i className="fas fa-ban text-muted" />
                )}
                {" - "}
                <i className="fas fa-euro-sign" />
                {jobAd.maxsalary ? (
                  jobAd.maxsalary
                ) : (
                  <i className="fas fa-ban text-muted" />
                )}
              </div>
              <div className="w-100">
                <label className="form-label w-100">
                  Expected Start Date:{" "}
                </label>
                {jobAd.expectedstartdate &&
                jobAd.expectedstartdate.toDate().toLocaleString() ? (
                  <ReactMoment format="MMM DD, YYYY">
                    {jobAd.expectedstartdate.toDate().toLocaleString()}
                  </ReactMoment>
                ) : (
                  <i className="fas fa-ban text-muted" />
                )}
              </div>
              <div className="w-100">
                <label className="form-label w-100">Expiration Date: </label>
                {jobAd.expirationdate &&
                jobAd.expirationdate.toDate().toLocaleString() ? (
                  <ReactMoment format="MMM DD, YYYY">
                    {jobAd.expirationdate.toDate().toLocaleString()}
                  </ReactMoment>
                ) : (
                  <i className="fas fa-ban text-muted" />
                )}
              </div>
            </div>
            <div className="col-md-6 col-12 mt-3">
              <div className="w-100">
                <label className="form-label w-100">Description: </label>
                {jobAd.jobdescription ? jobAd.jobdescription : ""}
              </div>
              <div className="w-100">
                <label className="form-label w-100">Other Benefits: </label>
                {jobAd.benefits && jobAd.benefits.length > 0 ? (
                  <>
                    {jobAd.benefits.map((ben, index) => {
                      return <div>{index + 1 + ". " + ben.benefitOffer}</div>;
                    })}
                  </>
                ) : (
                  <i className="fas fa-ban text-muted" />
                )}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container">
          <h4 className="mt-4 text-center font-weight-bold mb-4">
            <i className="far fa-address-card" /> Job Details
          </h4>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  const urlSplit = window.location.href.split("/");
  const jobAdId = urlSplit[urlSplit.length - 1];
  //console.log("state ",state);
  return {
    uid: state.firebase.auth.uid,
    auth: state.firebase.auth,
    authError: state.auth.authError,
    jobAdId: jobAdId,
    jobAdList: state.firestore.data.jobposting
  };
};

const mapDispatchToPropsJobseeker = dispatch => {
  return {};
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToPropsJobseeker
  ),
  firestoreConnect(props => {
    return [
      {
        collection: "jobposting",
        doc: props.jobAdId
      }
    ];
  })
)(JobMatchedDetails);
