import React from "react";
import "../profile/profile.css";
import "../app/app.css";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import * as ROUTES from "../../constants/routes";
import { Redirect } from "react-router-dom";
import ReactMoment from "react-moment";

class SeekerMatchedDetails extends React.Component {
  render() {
    const { auth, jobSeekerList, jobSeekerId } = this.props;
    if (!auth.uid && !auth.emailVerified)
      return <Redirect to={ROUTES.LOG_IN} />;
    if (jobSeekerList) {
      const jobSeeker = jobSeekerList[jobSeekerId]; // jobseeker is an array of 1. We need to take the first object
      // console.log("jobSeeker ",jobSeeker);
      return (
        <div className="container ">
          <h4 className="mt-4 text-center font-weight-bold mb-4">
            <i className="far fa-address-card" /> Job Seeker Details{" "}
          </h4>

          <div className="card justify-content-center">
            <div class="card-header bg-info text-center text-white">
              <b>
                {jobSeeker.jobSeekerName ? (
                  jobSeeker.jobSeekerName
                ) : (
                  <i className="fas fa-ban text-muted" />
                )}
              </b>
            </div>
            <div class="card-body ">
              <div className="col-12">
                <div className="form-group ">
                  <lable className="form-label no-space-break inline-label">
                    Phone:{" "}
                  </lable>
                  {jobSeeker.jobSeekerPhone ? (
                    jobSeeker.jobSeekerPhone
                  ) : (
                    <i className="fas fa-ban text-muted" />
                  )}
                  <br />
                  <lable className="form-label no-space-break inline-label">
                    Address:{" "}
                  </lable>
                  {jobSeeker.jobSeekerAddress ? (
                    jobSeeker.jobSeekerAddress
                  ) : (
                    <i className="fas fa-ban text-muted" />
                  )}
                  <br />
                  <lable className="form-label no-space-break inline-label">
                    City:{" "}
                  </lable>
                  {jobSeeker.city && jobSeeker.city.label ? (
                    jobSeeker.city.label ? (
                      jobSeeker.city.label
                    ) : (
                      jobSeeker.city
                    )
                  ) : (
                    <i className="fas fa-ban text-muted" />
                  )}
                  <br />
                  <lable className="form-label no-space-break inline-label">
                    Date Of Birth:{" "}
                  </lable>
                  {jobSeeker.DOBDate &&
                  jobSeeker.DOBDate.toDate().toLocaleString() ? (
                    <ReactMoment format="MMM DD, YYYY">
                      {jobSeeker.DOBDate.toDate().toLocaleString()}
                    </ReactMoment>
                  ) : (
                    <i className="fas fa-ban text-muted" />
                  )}
                  <br />
                  <lable className="form-label no-space-break inline-label">
                    Skills:{" "}
                  </lable>
                  {jobSeeker.skills && jobSeeker.skills.length > 0 ? (
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
                  <br />
                  <lable className="form-label no-space-break inline-label">
                    Education:{" "}
                  </lable>
                  {jobSeeker.education && jobSeeker.education.label ? (
                    jobSeeker.education.label ? (
                      jobSeeker.education.label
                    ) : (
                      jobSeeker.education
                    )
                  ) : (
                    <i className="fas fa-ban text-muted" />
                  )}
                  <br />
                  <lable className="form-label no-space-break inline-label">
                    Languages:{" "}
                  </lable>
                  {jobSeeker.languages && jobSeeker.languages.length > 0 ? (
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
                  {jobSeeker.workExperiences &&
                  jobSeeker.workExperiences.length > 0 ? (
                    <>
                      <br />
                      <lable className="form-label no-space-break inline-label">
                        Work Experiences:
                      </lable>
                      <br />
                    </>
                  ) : (
                    <>
                      <br />
                      <lable className="form-label no-space-break inline-label">
                        Work Experiences:
                      </lable>{" "}
                      <i className="fas fa-ban text-muted" />
                    </>
                  )}
                  {jobSeeker.workExperiences &&
                  jobSeeker.workExperiences.length > 0
                    ? jobSeeker.workExperiences.map(exp => {
                        return (
                          <div>
                            <div
                              class="card"
                              style={{
                                flexDirection: "column",
                                display: "inline-flex"
                              }}
                            >
                              <div class="card-body">
                                <div
                                  className="card-title font-weight-bold  text-center text-white"
                                  style={{ backgroundColor: "#ff2d55" }}
                                >
                                  <b>{exp.jobTitle}</b>
                                </div>
                                <lable className="form-label no-space-break inline-label">
                                  Company Name:
                                </lable>{" "}
                                {exp.companyName}
                                <br />
                                <lable className="form-label no-space-break inline-label">
                                  From:{" "}
                                </lable>
                                {exp.startJobDate &&
                                exp.startJobDate.toDate().toLocaleString() ? (
                                  <ReactMoment format="MMM DD, YYYY">
                                    {exp.startJobDate.toDate().toLocaleString()}
                                  </ReactMoment>
                                ) : (
                                  <i className="fas fa-ban text-muted" />
                                )}
                                <br />
                                <lable className="form-label no-space-break inline-label">
                                  To:{" "}
                                </lable>
                                {exp.endJobDate &&
                                exp.endJobDate.toDate().toLocaleString() ? (
                                  <ReactMoment format="MMM DD, YYYY">
                                    {exp.endJobDate.toDate().toLocaleString()}
                                  </ReactMoment>
                                ) : (
                                  <i className="fas fa-ban text-muted" />
                                )}
                                <br />
                                <lable className="form-label no-space-break inline-label">
                                  Job Description:
                                </lable>
                                {exp.jobDescription ? exp.jobDescription : ""}
                                <br />
                                <lable className="form-label no-space-break inline-label">
                                  Job Type While Working There:
                                </lable>
                                {exp.jobType ? exp.jobType : ""}
                              </div>
                            </div>
                            <br />
                          </div>
                        );
                      })
                    : ""}
                  <br />
                  <lable className="form-label no-space-break inline-label">
                    EU Citizen:
                  </lable>{" "}
                  {jobSeeker.euCitizen ? "Yes" : "No"}
                  <br />
                  <lable className="form-label no-space-break inline-label">
                    Minimum expected salary (€):
                  </lable>
                  {jobSeeker.minSalary ? (
                    jobSeeker.minSalary
                  ) : (
                    <i className="fas fa-ban text-muted" />
                  )}
                  <br />
                  <lable className="form-label no-space-break inline-label">
                    Interested In:{" "}
                  </lable>
                  {jobSeeker.applyingFullTime ? "Fulltime Job" : ""}
                  {jobSeeker.applyingFullTime && jobSeeker.applyingPartTime
                    ? " - "
                    : ""}
                  {jobSeeker.applyingPartTime ? "Parttime Job" : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container">
          <h4 className="mt-4 text-center font-weight-bold mb-4">
            <i className="far fa-address-card" /> Job Seeker Details
          </h4>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  const urlSplit = window.location.href.split("/");
  const jobSeekerId = urlSplit[urlSplit.length - 1];
  //console.log("state ",state);
  return {
    uid: state.firebase.auth.uid,
    auth: state.firebase.auth,
    authError: state.auth.authError,
    jobSeekerId: jobSeekerId,
    jobSeekerList: state.firestore.data.jobseeker
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
        collection: "jobseeker",
        doc: props.jobSeekerId
      }
    ];
  })
)(SeekerMatchedDetails);
