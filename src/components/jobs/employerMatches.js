import React, { Component } from "react";
import { firestoreConnect } from "react-redux-firebase";
import "../profile/profile.css";
import * as ROUTES from "../../constants/routes";
import { connect } from "react-redux";
import { compose } from "redux";
import { Redirect, NavLink } from "react-router-dom";
import "../app/app.css";
import _ from "lodash";

class EmployerMatches extends Component {
  redirectToNewChatWindow = emailstr => {
    this.props.history.push({
      pathname: ROUTES.CHAT_DASHBOARD,
      state: {
        email: emailstr
      }
    });
  };
  render() {
    const { auth, employerMatchedJobSeekersList, jobAd } = this.props;
    if (!auth.uid && !auth.emailVerified)
      return <Redirect to={ROUTES.LOG_IN} />;
    if (employerMatchedJobSeekersList.length !== 0) {
      return (
        <div>
          {/* <input type="hidden" id="hdnJobAdId" value={state.jobAdId}></input> */}
          <div className="container page-wrapper">
            <div className="card-container">
              <h4 className="mt-4 text-center font-weight-bold">
                <i className="fas fa-wave-square" /> Matches for position "
                {jobAd && jobAd.jobtitle}"
              </h4>
              <div className="row mt-4" align="center">
                {employerMatchedJobSeekersList &&
                  employerMatchedJobSeekersList.map(jobSeeker => {
                    return (
                      <div
                        id={jobSeeker.id}
                        key={jobSeeker.id}
                        className="col-lg-4 col-md-6 col-12 job-seeker-wrapper mt-2"
                      >
                        <div className="card job-ad text-body shadow rounded">
                          {/* <div className="card-header bg-white text-info font-weight-bold">
                            <div className="row">
                              <div className="col-12 text-center">
                                <i className="fas fa-user-tag" />{" "}
                                {jobSeeker.jobSeekerName}
                              </div>
                            </div>
                          </div> */}
                          <div className="card-body">
                            <div className="row">
                              <div className="col-12">
                                <b className="mr-2">
                                  <i className="fas fa-universal-access"></i> Skills:
                                </b>
                                {jobSeeker.skills &&
                                jobSeeker.skills.length > 0 ? (
                                  jobSeeker.skills.map(skill => {
                                    return (
                                      <span
                                        key={jobSeeker.id + "_" + skill.value}
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
                              <div className="col-12">
                                <b>
                                  <i className="fas fa-graduation-cap" />{" "}
                                  Education:
                                </b>{" "}
                                {jobSeeker.education &&
                                jobSeeker.education.label ? (
                                  jobSeeker.education.label ? (
                                    jobSeeker.education.label
                                  ) : (
                                    jobSeeker.education
                                  )
                                ) : (
                                  <i className="fas fa-ban text-muted" />
                                )}
                              </div>
                              <div className="col-12">
                                <b className="mr-2">
                                  <i className="fas fa-check-double" /> Work
                                  Experiences:
                                </b>
                                {jobSeeker.workExperiences &&
                                jobSeeker.workExperiences.length > 0 ? (
                                  jobSeeker.workExperiences.map(exp => {
                                    return (
                                      <span
                                        key={
                                          exp.companyName + "_" + exp.jobTitle
                                        }
                                        className="badge badge-warning mr-2"
                                      >
                                        {exp.companyName}
                                      </span>
                                    );
                                  })
                                ) : (
                                  <i className="fas fa-ban text-muted" />
                                )}
                              </div>

                              <div className="col-12">
                                <b className="mr-2">
                                  <i className="fas fa-language" /> Languages:
                                </b>
                                {jobSeeker.languages &&
                                jobSeeker.languages.length > 0 ? (
                                  jobSeeker.languages.map(lang => {
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
                              <div className="col-12">
                                <b>
                                  <i className="fas fa-certificate" /> Desired
                                  Job Type:
                                </b>{" "}
                                {(jobSeeker.applyfulltime &&
                                jobSeeker.applyfulltime
                                  ? "Full Time"
                                  : "Part Time") ||
                                  (jobSeeker.applypartime &&
                                  jobSeeker.applypartime
                                    ? "Part Time"
                                    : "Full Time")}
                              </div>
                              <div className="col-12">
                                <b>
                                  <i className="fas fa-euro-sign" /> Min Salary:
                                </b>{" "}
                                {jobSeeker.minSalary ? (
                                  jobSeeker.minSalary
                                ) : (
                                  <i className="fas fa-ban text-muted" />
                                )}
                              </div>

                              <div className="col-12">
                                <b>
                                  <i className="fas fa-envelope" />:
                                </b>{" "}
                                {jobSeeker.jobSeekerEmail ? (
                                  jobSeeker.jobSeekerEmail
                                ) : (
                                  <i className="fas fa-ban text-muted" />
                                )}
                              </div>                              
                            </div>
                          </div>
                          <div className="job-ad-actions">
                            <div className="job-ad-action">
                              <NavLink
                                id="btnMatch"
                                className="btn btn-info btn-sm w-100 m-0"
                                to={{
                                  pathname:
                                    ROUTES.SEEKER_MATCHED_DETAILS +
                                    "/" +
                                    jobSeeker.id
                                }}
                              >
                                <i className="fas fa-user"></i><br/>
                                Profile
                              </NavLink>
                            </div>
                            <div className="job-ad-action">
                              <NavLink
                                className="btn btn-success btn-sm w-100 m-0"
                                to={ROUTES.CHAT_DASHBOARD}
                                onClick={() =>
                                  this.redirectToNewChatWindow(
                                    jobSeeker.jobSeekerEmail
                                      ? jobSeeker.jobSeekerEmail
                                      : ""
                                  )
                                }
                              >
                                <i className="far fa-comments"></i><br/>
                                Chat
                              </NavLink>
                            </div>                            
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container">
          <h4 className="mt-4 text-center font-weight-bold">
            <i className="fas fa-wave-square" /> Matched Job Seekers
          </h4>

          <h6 className="text-center mt-4">
            There are no matches for this job yet.
          </h6>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  const urlSplit = window.location.href.split("/");
  const jobAdId = urlSplit[urlSplit.length - 1];
  const jobseekers = state.firestore.ordered.jobseeker;
  const matches = state.firestore.ordered.match;
  const employerMatchedJobSeekersList = _.intersectionWith(
    jobseekers,
    matches,
    function(jobseeker, match) {
      return jobseeker.id === match.jobSeekerId && jobAdId === match.jobAdId;
    }
  );
  //retrieving jobAd for sorting
  let jobAds = state.firestore.data.jobposting;
  let jobAd = jobAds && jobAdId ? jobAds[jobAdId] : null;

  return {
    uid: state.firebase.auth.uid,
    auth: state.firebase.auth,
    authError: state.auth.authError,
    employerMatchedJobSeekersList: employerMatchedJobSeekersList,
    jobAdId: jobAdId,
    jobAd: jobAd
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
        collection: "match",
        where: [["employerID", "==", props.uid || null]]
      },
      {
        collection: "jobseeker"
      },
      {
        collection: "jobposting"
      }
    ];
  })
)(EmployerMatches);
