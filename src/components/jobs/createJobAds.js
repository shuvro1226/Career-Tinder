import React from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import "react-datepicker/dist/react-datepicker.css";
import {
  Alert,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import {
  jobAdActions,
  jobUpdateActions
} from "../../store/actions/jobAdActions";
import * as ROUTES from "../../constants/routes";
import { Redirect } from "react-router-dom";
import { Checkbox } from "pretty-checkbox-react";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import $ from "jquery/src/jquery";

const jobAdEntity = {
  jobtitle: null,
  neededskills: null,
  applypartime: false,
  applyfulltime: false,
  minsalary: null,
  maxsalary: null,
  jobdescription: null,
  education: null,
  expectedstartdate: null,
  expirationdate: null,
  visible: false,
  location: null,
  benefits: null,
  languages: null
};

class CreateJobAds extends React.Component {
  handleSkillsChange = neededskills => {
    if (neededskills) {
      neededskills.forEach(neededskills => {
        if (neededskills["__isNew__"]) {
          delete neededskills["__isNew__"];
        }
      });
    }
    this.setState({ neededskills });
  };
  handleLanguagesChange = languages => {
    this.setState({ languages });
  };
  handleLocationChange = location => {
    this.setState({ location });
  };
  handleEducationChange = education => {
    this.setState({ education });
  };
  getPickerValue = value => {
    // console.log(value);
  };

  constructor(props) {
    super(props);
    this.state = {
      jobtitle: "",
      neededskills: "",
      applypartime: false,
      applyfulltime: false,
      minsalary: "",
      maxsalary: "",
      jobdescription: "",
      education: "",
      expectedstartdate: "",
      expirationdate: "",
      visible: false,
      location: "",
      benefit: "",
      benefits: [],
      benefitId: "",
      benefitCreate: true,
      benefitModal: false,
      benefitRemoveModal: false,
      benefitOffer: "",
      languages: ""
    };
    this.onShowAlert = this.onShowAlert.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleBenefitRemove = this.toggleBenefitRemove.bind(this);
    this.handleBenefitDelete = this.handleBenefitDelete.bind(this);
    if (this.props.location.job) {
      var modifiableJobAd = this.props.location.job;
      if (modifiableJobAd.id) this.state.id = modifiableJobAd.id;
      if (modifiableJobAd.jobtitle)
        this.state.jobtitle = modifiableJobAd.jobtitle;
      if (modifiableJobAd.neededskills)
        this.state.neededskills = modifiableJobAd.neededskills;
      if (modifiableJobAd.languages)
        this.state.languages = modifiableJobAd.languages;
      if (modifiableJobAd.applypartime)
        this.state.applypartime = modifiableJobAd.applypartime;
      if (modifiableJobAd.applyfulltime)
        this.state.applyfulltime = modifiableJobAd.applyfulltime;
      if (modifiableJobAd.minsalary)
        this.state.minsalary = modifiableJobAd.minsalary;
      if (modifiableJobAd.maxsalary)
        this.state.maxsalary = modifiableJobAd.maxsalary;
      if (modifiableJobAd.jobdescription)
        this.state.jobdescription = modifiableJobAd.jobdescription;
      if (modifiableJobAd.education) {
        this.state.education = modifiableJobAd.education;
      }
      if (modifiableJobAd.benefits) {
        modifiableJobAd.benefits.map((item, value) => {
          item.id = Math.random()
            .toString(36)
            .slice(2);
        });
        this.state.benefits = modifiableJobAd.benefits;
      }
      if (modifiableJobAd.expectedstartdate)
        this.state.expectedstartdate = modifiableJobAd.expectedstartdate.toDate();
      if (modifiableJobAd.expirationdate)
        this.state.expirationdate = modifiableJobAd.expirationdate.toDate();
      if (modifiableJobAd.location)
        this.state.location = modifiableJobAd.location;
    }
  }

  handleDateChange = (name, value) => {
    this.setState({
      [name]: value
    });
  };

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleChangeFT = () => {
    this.setState(prevState => ({
      applyfulltime: !prevState.applyfulltime
    }));
  };

  handleChangePT = () => {
    this.setState(prevState => ({
      applypartime: !prevState.applypartime
    }));
  };

  handleSubmit = event => {
    event.preventDefault();
    //take the information from state that should be stored in DB (state contains more data than needed):
    var jobAdProfile = jobAdEntity;

    if (this.state.jobtitle) {
      jobAdProfile.jobtitle = this.state.jobtitle;
    } else {
      jobAdProfile.jobtitle = null;
    }
    if (this.state.neededskills) {
      jobAdProfile.neededskills = this.state.neededskills;
    } else {
      jobAdProfile.neededskills = null;
    }
    if (this.state.applypartime) {
      jobAdProfile.applypartime = true;
    } else {
      jobAdProfile.applypartime = false;
    }
    if (this.state.applyfulltime) {
      jobAdProfile.applyfulltime = true;
    } else {
      jobAdProfile.applyfulltime = false;
    }
    if (this.state.minsalary) {
      jobAdProfile.minsalary = this.state.minsalary;
    } else {
      jobAdProfile.minsalary = null;
    }
    if (this.state.maxsalary) {
      jobAdProfile.maxsalary = this.state.maxsalary;
    } else {
      jobAdProfile.maxsalary = null;
    }
    if (this.state.jobdescription) {
      jobAdProfile.jobdescription = this.state.jobdescription;
    } else {
      jobAdProfile.jobdescription = null;
    }
    if (this.state.education) {
      jobAdProfile.education = this.state.education;
    } else {
      jobAdProfile.education = null;
    }
    if (this.state.expectedstartdate) {
      jobAdProfile.expectedstartdate = this.state.expectedstartdate;
    } else {
      jobAdProfile.expectedstartdate = null;
    }
    if (this.state.expirationdate) {
      jobAdProfile.expirationdate = this.state.expirationdate;
    } else {
      jobAdProfile.expirationdate = null;
    }
    if (this.state.visible) {
      jobAdProfile.visible = this.state.visible;
    } else {
      jobAdProfile.visible = false;
    }
    if (this.state.location) {
      jobAdProfile.location = this.state.location;
    } else {
      jobAdProfile.location = null;
    }
    //    if (this.state.benefits) {jobAdProfile.benefits    =  this.state.benefits; }
    if (this.state.languages) {
      jobAdProfile.languages = this.state.languages;
    } else {
      jobAdProfile.languages = null;
    }
    if (this.state.benefits.length > 0) {
      var tmpBenef = [];
      for (var i = 0, l = this.state.benefits.length; i < l; i++) {
        var tmpBen = {
          benefitOffer: null,
          id: null
        };
        if (this.state.benefits[i].benefitOffer) {
          tmpBen.benefitOffer = this.state.benefits[i].benefitOffer;
        }
        if (this.state.benefits[i].id) {
          tmpBen.id = this.state.benefits[i].id;
        }

        if (i === 0) {
          tmpBenef[0] = tmpBen;
        } else {
          tmpBenef = [...tmpBenef, tmpBen];
        }
      }
      if (tmpBenef.length > 0) {
        jobAdProfile.benefits = tmpBenef;
      }
    } else {
      jobAdProfile.benefits = null;
    }

    event.target.className += " was-validated";
    var successMessage = "Job Ad Successfully Created";
    if (this.state.id) {
      this.props.jobUpdateActions(this.state.id, jobAdProfile);
      successMessage = "Job Ad Successfully Updated";
    } else {
      this.props.jobAdActions(jobAdProfile);
    }
    Swal.fire({
      type: "success",
      title: successMessage,
      showConfirmButton: false,
      timer: 1500
    });

    setTimeout(() => {
      this.props.history.push("/jobs");
    }, 2000);
  };

  handleBenefitSubmit = e => {
    this.toggle();
    e.preventDefault();
    if (e.target.benefitId.value === "") {
      const newBenefit = {
        id: Math.random()
          .toString(36)
          .slice(2),
        benefitOffer: e.target.benefitOffer.value
      };
      newBenefit.benefitOffer !== "" &&
        this.setState({
          benefits: [...this.state.benefits, newBenefit]
        });
    } else {
      let updatedBenefits = [...this.state.benefits];
      let benefit = updatedBenefits.find(
        b => b.id === e.target.benefitId.value
      );
      benefit.benefitOffer = e.target.benefitOffer.value;
      benefit.benefitOffer !== "" &&
        this.setState({
          benefits: updatedBenefits
        });
    }
  };

  handleBenefitDelete() {
    let benefit = this.state.benefit;
    const newBenefits = this.state.benefits.filter(benefitOffer => {
      return benefitOffer !== benefit;
    });

    this.setState(prevState => ({
      benefits: [...newBenefits],
      benefitRemoveModal: !prevState.benefitRemoveModal
    }));
  }

  state = {
    visible: false
  };

  onShowAlert = () => {
    this.setState({ visible: true }, () => {
      window.setTimeout(() => {
        this.setState({ visible: false });
      }, 3000);
    });
  };

  toggle() {
    this.setState(prevState => ({
      benefitModal: !prevState.benefitModal,
      benefitCreate: true,
      benefitId: "",
      benefitOffer: ""
    }));
  }

  toggleBenefitRemove(e, offer) {
    this.setState(prevState => ({
      benefitRemoveModal: !prevState.benefitRemoveModal,
      benefit: offer
    }));
  }

  toggleModalWithData(e, benefit, id) {
    if (e.target.id !== id) {
      this.setState(prevState => ({
        benefitModal: true,
        benefitCreate: false,
        benefitId: benefit.id,
        benefitOffer: benefit.benefitOffer
      }));
    }
  }

  render() {
    //isOpen={this.state.visible}
    const {
      auth,
      response,
      message,
      educationList,
      locationList,
      skillsList,
      languageList
    } = this.props;
    if (!auth.uid && !auth.emailVerified)
      return <Redirect to={ROUTES.LOG_IN} />;
    return (
      <div className="create-job-ad">
        <Alert color={response} isOpen={this.state.visible}>
          <i
            className={response === "success" ? "fas fa-check" : "fas fa-times"}
          />{" "}
          {message}
        </Alert>
        <Modal
          isOpen={this.state.benefitModal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>
            <i className="fas fa-info-circle text-warning" />{" "}
            {this.state.benefitCreate ? "Add" : "Edit"} benefit
          </ModalHeader>
          <ModalBody>
            <form
              className="bonus-offer-form text-info"
              onSubmit={this.handleBenefitSubmit}
            >
              <div className="row">
                <div className="col-12">
                  <input
                    id="benefitId"
                    type="hidden"
                    name="benefitId"
                    value={this.state.benefitId}
                  />
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="benefitOffer">
                          <i className="far fa-address-card" /> Offer details
                        </label>
                        <textarea
                          type="text"
                          id="benefitOffer"
                          name="benefitOffer"
                          value={this.state.benefitOffer}
                          className="form-control form-control-lg"
                          onChange={this.handleChange}
                          rows="1"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <hr className="mt-4 mb-4" />
                  <Button color="success" type="submit">
                    <i
                      className={
                        this.state.benefitCreate ? "fas fa-plus" : "fas fa-edit"
                      }
                    />{" "}
                    {this.state.benefitCreate ? "Add" : "Update"}
                  </Button>{" "}
                  <Button color="danger" onClick={this.toggle}>
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={this.state.benefitRemoveModal}
          toggle={e => this.toggleBenefitRemove(e, "")}
          className={this.props.className}
        >
          <ModalHeader toggle={e => this.toggleBenefitRemove(e, "")}>
            <i className="fas fa-info-circle text-warning" /> Remove Benefit
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-12">
                Do you really want to remove this benefit from your job ad?
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.handleBenefitDelete}>
              <i className="fas fa-trash-alt" /> Remove
            </Button>{" "}
            <Button
              color="primary"
              onClick={e => this.toggleBenefitRemove(e, "")}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <div className="container page-wrapper">
          <h3 className="text-center font-weight-bold mt-4">
            <i
              className={
                this.state.jobtitle !== ""
                  ? "fas fa-edit"
                  : "fas fa-plus-square"
              }
            />
            <br />
            {this.state.jobtitle !== "" ? "Edit Job Ad" : "Create Job Ad"}
          </h3>
          <div className="row justify-content-center">
            <div className="col-lg-8 col-12">
              <form
                className="empr-form mt-4 mb-4"
                onSubmit={this.handleSubmit}
              >
                <div className="form-group">
                  <label className="form-label" htmlFor="jobtitle">
                    <i className="fas fa-file-signature" /> Job Title
                  </label>
                  <input
                    type="text"
                    id="jobtitle"
                    name="job_title"
                    value={this.state.jobtitle}
                    className="form-control"
                    onChange={this.handleChange}
                    placeholder="Job Title"
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-10">
                    <div className="form-group">
                      <label className="form-label w-100">
                        <i className="fas fa-map-marked-alt" /> Employment type
                      </label>
                      <Checkbox
                        icon={<i className="fas fa-check-double" />}
                        animation="jelly"
                        shape="curve"
                        color="primary-o"
                        id="applyfulltime"
                        name="applyfulltime"
                        checked={this.state.applyfulltime ? true : false}
                        onChange={this.handleChangeFT}
                      >
                        Full-time
                      </Checkbox>
                      <Checkbox
                        icon={<i className="fas fa-check-double" />}
                        animation="jelly"
                        shape="curve"
                        color="primary-o"
                        id="applypartime"
                        name="applypartime"
                        checked={this.state.applypartime ? true : false}
                        onChange={this.handleChangePT}
                      >
                        Part-time
                      </Checkbox>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-code" /> Needed Skills
                      </label>
                      <CreatableSelect
                        value={this.state.neededskills}
                        onChange={this.handleSkillsChange}
                        options={skillsList}
                        isMulti={true}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="joblocation"
                        name="joblocation"
                      >
                        <i className="fas fa-map-marker-alt" /> Job Location
                      </label>
                      <Select
                        value={this.state.location}
                        onChange={this.handleLocationChange}
                        options={locationList}
                        isMulti={true}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-address-card" /> Education
                  </label>
                  {/* handle old data where education id is saved instead of value-lable pair  */}
                  {this.state.education &&
                  (this.state.education.label === undefined ||
                    this.state.education.label === null) ? (
                    <Select
                        value={educationList && educationList.filter(
                        option => option.value === this.state.education
                      )}
                      onChange={this.handleEducationChange}
                      options={educationList}
                      isMulti={false}
                    />
                  ) : (
                    <Select
                      value={this.state.education}
                      onChange={this.handleEducationChange}
                      options={educationList}
                      isMulti={false}
                    />
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fas fa-address-card" /> Required Languages
                      </label>
                      <Select
                        value={this.state.languages}
                        onChange={this.handleLanguagesChange}
                        options={languageList}
                        isMulti={true}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12" />
                </div>

                <div className="row">
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fa fa-euro-sign" /> Expected Minimum
                        Salary(Yearly)
                      </label>
                      <input
                        className="form-control"
                        placeholder="40000"
                        id="minsalary"
                        type="number"
                        value={this.state.minsalary}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="fa fa-euro-sign" /> Expected Maximum
                        Salary(Yearly)
                      </label>
                      <input
                        className="form-control"
                        placeholder="60000"
                        id="maxsalary"
                        type="number"
                        value={this.state.maxsalary}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="jobdescription">
                    <i className="fas fa-sticky-note" /> Description
                  </label>
                  <textarea
                    id="jobdescription"
                    name="job_discription"
                    value={this.state.jobdescription}
                    className="form-control"
                    onChange={this.handleChange}
                    required
                  />
                </div>

                <div className="row mb-4">
                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label w-auto mr-2">
                        <i className="fab fa-angellist" /> Benefits
                      </label>
                      <button
                        type="button"
                        className="btn btn-danger btn-circle"
                        onClick={this.toggle}
                      >
                        <i className="fas fa-plus" />
                      </button>
                    </div>
                    <div className="row" id="benefits">
                      {this.state.benefits.map((benefit, i) => {
                        return (
                          <div
                            key={`benefit-${i}`}
                            className="col-lg-4 col-md-6 col-12"
                          >
                            <div className="bonus-offers-tag badge badge-info mb-2">
                              <div className="row">
                                <div className="col-8 text-left">
                                  <span>{benefit.benefitOffer}</span>
                                </div>
                                <div className="col-4">
                                  <i
                                    id={"remove_bonus_" + i}
                                    className="fas fa-trash-alt ml-3 float-right"
                                    onClick={e =>
                                      this.toggleBenefitRemove(e, benefit)
                                    }
                                  />
                                  <i
                                    id={"edit_bonus_" + i}
                                    onClick={e =>
                                      this.toggleModalWithData(
                                        e,
                                        benefit,
                                        "remove_bonus_" + i
                                      )
                                    }
                                    className="fas fa-edit float-right"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 col-12">
                    <div className="form-group datepicker">
                      <label className="form-label w-100">
                        <i className="fas fa-calendar-alt prefix" /> Expected
                        Start Date
                      </label>
                      <DatePicker
                        selected={this.state.expectedstartdate}
                        onChange={this.handleDateChange.bind(
                          this.parentElement,
                          "expectedstartdate"
                        )}
                        className="form-control"
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        name="expectedstartdate"
                        minDate={new Date()}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="form-group datepicker">
                      <label className="form-label w-100">
                        <i className="fas fa-calendar-alt prefix" /> Expiration
                        Date
                      </label>
                      <DatePicker
                        selected={this.state.expirationdate}
                        onChange={this.handleDateChange.bind(
                          this.parentElement,
                          "expirationdate"
                        )}
                        className="form-control"
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        name="expirationdate"
                        minDate={new Date()}
                        autoComplete="off"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-info w-100 mt-4">
                  <i className="fas fa-save" /> Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  var returnObject = {
    auth: state.firebase.auth,
    response: state.profile.response,
    message: state.profile.message
  };

  const skillsData = state.firestore.data.Skill;
  const educationData = state.firestore.data.education;
  const locationData = state.firestore.data.city;
  const languageData = state.firestore.data.language;

  if (skillsData && educationData && locationData && languageData) {
    var result = [];
    $.each(skillsData, function(index, item) {
      result.push({
        value: index,
        label: item.name
      });
    });
    returnObject.skillsList = result;
    //    console.log(result);

    result = [];
    $.each(educationData, function(index, item) {
      result.push({
        value: index,
        label: item.name
      });
    });
    returnObject.educationList = result;

    result = [];
    $.each(locationData, function(index, item) {
      result.push({
        value: index,
        label: item.name
      });
    });
    returnObject.locationList = result;
    //    console.log(result);

    result = [];
    $.each(languageData, function(index, item) {
      result.push({
        value: index,
        label: item.name
      });
    });
    returnObject.languageList = result;
    //    console.log(result);
  }
  return returnObject;
};

const mapDispatchToProps = dispatch => {
  return {
    jobAdActions: jobAd => dispatch(jobAdActions(jobAd)),
    jobUpdateActions: (jobAdId, jobAd) =>
      dispatch(jobUpdateActions(jobAdId, jobAd))
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect([
    {
      collection: "education",
      orderBy: ["name", "asc"]
    },
    {
      collection: "Skill",
      orderBy: ["name", "asc"]
    },
    {
      collection: "city",
      orderBy: ["name", "asc"]
    },
    {
      collection: "language",
      orderBy: ["name", "asc"]
    }
  ])
)(CreateJobAds);
