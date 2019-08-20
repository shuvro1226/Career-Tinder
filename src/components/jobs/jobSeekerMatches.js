import React, { Component } from "react";
import * as ROUTES from "../../constants/routes";
import { connect } from "react-redux";
import { compose } from "redux";
import { Redirect, NavLink } from "react-router-dom";
import "./jobs.css";
import { firestoreConnect } from "react-redux-firebase";
import _ from "lodash";
import $ from "jquery/src/jquery";
import ReactMoment from "react-moment";

class JobSeekerMatches extends Component {
  redirectToNewChatWindow = emailstr => {
    this.props.history.push({
      pathname: ROUTES.CHAT_DASHBOARD,
      state: {
        email: emailstr
      }
    });
  };
  render() {
    const { auth, jobseekerMatchedJobPosting } = this.props;

    if (!auth.uid && !auth.emailVerified)
      return <Redirect to={ROUTES.LOG_IN} />;
    if (jobseekerMatchedJobPosting.length !== 0) {
      return (
        <div className="container page-wrapper">
          <h4 className="mt-4 text-center font-weight-bold">
            <i className="fas fa-wave-square" /> Matched Jobs
          </h4>
          <div className="row job-ads-wrapper mt-4" align="center">
            {jobseekerMatchedJobPosting.map(item => {
              return (
                <div
                  id={item.id}
                  key={item.id}
                  className="col-lg-4 col-md-6 col-12 mt-2 job-ad-wrapper"
                >
                  {" "}
                  {/*this is temporal: id must contain de id of document JobPosting from DB*/}
                  <div className="card job-ad text-body shadow rounded">
                    <div className="card-header bg-white text-info font-weight-bold">
                      <div className="row">
                        <div className="col-12 text-center">
                          <i className="fas fa-thumbtack" /> {item.jobtitle}
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <b>
                            <i className="fas fa-building" /> Company:
                          </b>{" "}
                          {item.employername}
                        </div>
                        <div className="col-12">
                          <b className="mr-2">
                            <i className="fas fa-check-double" /> Skills:
                          </b>
                          {item.neededskills &&
                            item.neededskills.map(child => {
                              return (
                                <span
                                  key={child.value}
                                  className="badge badge-danger mr-2"
                                >
                                  {child.label}
                                </span>
                              );
                            })}
                        </div>
                        <div className="col-12">
                          <b>
                            <i className="fas fa-certificate" /> Type:
                          </b>{" "}
                          {(item.applyfulltime && item.applyfulltime
                            ? "Full Time"
                            : "Part Time") ||
                            (item.applypartime && item.applypartime
                              ? "Part Time"
                              : "Full Time")}
                        </div>
                        <div className="col-12">
                          <b>
                            <i className="fas fa-euro-sign" /> Salary:
                          </b>{" "}
                          {item.minsalary} - {item.maxsalary}
                        </div>
                        <div className="col-12">
                          <b>
                            <i className="fas fa-calendar-alt" /> Start
                          </b>{" "}
                          {item.expectedstartdate &&
                          item.expectedstartdate.toDate().toLocaleString() ? (
                            <ReactMoment format="MMM DD, YYYY">
                              {item.expectedstartdate.toDate().toLocaleString()}
                            </ReactMoment>
                          ) : (
                            <i className="fas fa-ban text-muted" />
                          )}
                        </div>
                        <div className="col-12">
                          <b>
                            <i className="fas fa-calendar-alt" /> Due Date:
                          </b>{" "}
                          {item.expirationdate &&
                          item.expirationdate.toDate().toLocaleString() ? (
                            <ReactMoment format="MMM DD, YYYY">
                              {item.expirationdate.toDate().toLocaleString()}
                            </ReactMoment>
                          ) : (
                            <i className="fas fa-ban text-muted" />
                          )}
                        </div>
                        <div className="col-12">
                          <b>
                            <i className="fas fa-graduation-cap" /> Education:
                          </b>{" "}
                          {item.education && item.education.label ? (
                            item.education.label ? (
                              item.education.label
                            ) : (
                              item.education
                            )
                          ) : (
                            <i className="fas fa-ban text-muted" />
                          )}
                        </div>

                        <div className="col-12">
                          <b>
                            <i className="fas fa-envelope" /> Employer email:
                          </b>{" "}
                          {item.employeremail ? (
                            item.employeremail
                          ) : (
                            <i className="fas fa-ban text-muted" />
                          )}
                        </div>

                        <div className="col-12">
                          <b />
                        </div>
                        <div className="col-12 text-right" />
                      </div>
                    </div>
                    <div className="job-ad-actions">
                      <div className="job-ad-action">
                        <NavLink
                          id="btnMatch"
                          className="btn btn-info btn-sm w-100 m-0"
                          to={{
                            pathname: ROUTES.JOB_MATCHED_DETAILS + "/" + item.id
                          }}
                        >
                          <i className="fas fa-ad" />
                          <br />
                          Job Details
                        </NavLink>
                      </div>
                      <div className="job-ad-action">
                        <NavLink
                          className="btn btn-success btn-sm w-100 m-0"
                          to={ROUTES.CHAT_DASHBOARD}
                          onClick={() =>
                            this.redirectToNewChatWindow(
                              item.employeremail ? item.employeremail : ""
                            )
                          }
                        >
                          <i className="far fa-comments" />
                          <br />
                          Message
                        </NavLink>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else {
      return (
        <div className="container">
          <h4 className="mt-4 text-center font-weight-bold">
            <i className="fas fa-wave-square" /> Matched Jobs
          </h4>
          <h6 className="mt-4 text-center">
            There are no matched jobs for you yet.
          </h6>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  const auth = state.firebase.auth;
  const jobposting = state.firestore.ordered.jobposting;
  const matches = state.firestore.ordered.match;
  const jobseekers = state.firestore.data.jobseeker;
  const jobseeker = jobseekers ? jobseekers[auth.uid] : null;

  const jobseekerMatchedJobPosting = _.intersectionWith(
    jobposting,
    matches,
    function(jobpost, match) {
      return jobpost.id === match.jobAdId;
    }
  );

  //fill the education item name instead if the key
  const allEducationData = state.firestore.data.education;
  if (
    allEducationData !== undefined &&
    jobseekerMatchedJobPosting !== undefined &&
    jobseekerMatchedJobPosting.length > 0
  ) {
    $.each(jobseekerMatchedJobPosting, function(index, jobAd) {
      var educationItem = allEducationData[jobAd.education];
      if (educationItem !== undefined) jobAd.education = educationItem.name;
    });
  }
  return {
    jobseekerMatchedJobPosting: jobseekerMatchedJobPosting,
    uid: auth.uid,
    auth: auth,
    jobseeker: jobseeker
  };
};

const mapDispatchToPropsJobseeker = dispatch => {
  // console.log(state);
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
        where: [["jobSeekerId", "==", props.uid || null]]
      },
      {
        collection: "jobposting",
        orderBy: ["createdAt", "desc"]
      },
      {
        collection: "education"
      }
    ];
  })
)(JobSeekerMatches);
