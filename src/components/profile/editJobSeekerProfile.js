import React from 'react';
import DatePicker from "react-datepicker";
import Select from 'react-select';
import { ModalFooter } from "mdbreact";
import './profile.css';
import { connect } from "react-redux";
import { compose } from "redux";
import { Redirect, withRouter } from "react-router-dom";
import { Alert, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { editJobSeekerProfile } from '../../store/actions/profileAction';
import * as ROUTES from '../../constants/routes';
import { firestoreConnect } from "react-redux-firebase";
import { Checkbox, Radio } from 'pretty-checkbox-react';
import CreatableSelect from 'react-select/creatable';
import swal from "sweetalert";
import $ from "jquery/src/jquery";
 
//Entity to store JobSeekerProfile in DB
const jobSeekerProfileEntity = {
  jobSeekerName: null,  
  jobSeekerPhone: null,  
  jobSeekerAddress: null,
  applyingFullTime: false,
  applyingPartTime: false,
  euCitizen: false,
  minSalary: null,
//  maxSalary: null,
  languages: null,
    //  label: field of languages
    //  value: field of languages
  skills: null,
    //  label: field of skills
    //  value: field of skills
  DOBDate: null,
  city: null,
  education: null,
  workExperiences: null
    
}
 
class EditJobSeekerProfile extends React.Component {
 
  handleSkillsChange = skills => {
    if(skills){
      skills.forEach(skill => {
        if(skill['__isNew__']){
          delete skill['__isNew__']
        }
      });
    }
    this.setState({ skills });
  };

  handleCityChange = (city) => {
    this.setState({ city: city });
 //   console.log(`Option selected:`, city);
  }

  handleEducationChange = (education) => {
    this.setState({ education: education });
 //   console.log(`Option selected:`, education);
  }

  handleLanguagesChange = languages => {
    if(languages){
      languages.forEach(languages => {
        if(languages['__isNew__']){
          delete languages['__isNew__']
        }
      });
    }
    this.setState({ languages });
  };
 
  constructor(props) {
    super(props);
 
    var jobSeekerProfileProps = this.props.jobseeker;
    var jobSeekerName = jobSeekerProfileProps && jobSeekerProfileProps.jobSeekerName;
    var jobSeekerPhone = jobSeekerProfileProps && jobSeekerProfileProps.jobSeekerPhone;
    var jobSeekerAddress = jobSeekerProfileProps && jobSeekerProfileProps.jobSeekerAddress;
    var applyingFullTime = jobSeekerProfileProps && jobSeekerProfileProps.applyingFullTime;
    var applyingPartTime = jobSeekerProfileProps && jobSeekerProfileProps.applyingPartTime;
    var euCitizen = jobSeekerProfileProps && jobSeekerProfileProps.euCitizen;
    var minSalary = jobSeekerProfileProps && jobSeekerProfileProps.minSalary;
    var jobSeekerEmail = jobSeekerProfileProps && jobSeekerProfileProps.jobSeekerEmail;
    var DOBDate = jobSeekerProfileProps && jobSeekerProfileProps.DOBDate;
    var skills = jobSeekerProfileProps && jobSeekerProfileProps.skills;
    var languages = jobSeekerProfileProps && jobSeekerProfileProps.languages;
    var workExperiences = (jobSeekerProfileProps && jobSeekerProfileProps.workExperiences !== null) ? jobSeekerProfileProps.workExperiences : [];
    var city = jobSeekerProfileProps && jobSeekerProfileProps.city;
    var education = jobSeekerProfileProps && jobSeekerProfileProps.education;
 
    workExperiences &&  workExperiences.map((item, value) => {
      item.id = Math.random().toString(36).slice(2);
    });
 
    this.state = {
      jobSeekerName: jobSeekerName,
      jobSeekerPhone: jobSeekerPhone,
      jobSeekerAddress: jobSeekerAddress,
      jobSeekerEmail: jobSeekerEmail,
      applyingFullTime: applyingFullTime,
      applyingPartTime: applyingPartTime,
      euCitizen: euCitizen,
      minSalary: minSalary,
//      maxSalary: maxSalary,
      languages: languages,
      education: education,
      skills: skills,
      startDOBDate: DOBDate && DOBDate.toDate(),
 
      weId: '',
      weCreate: true,
      companyName: '',
      jobTitle: '',
      jobDescription: '',
      startFromDate: '',
      workedTo: '',
      visible: false,
      modal: false,
      weRemoveModal: false,
      workExperience: '',
      workExperiences: workExperiences,
      city: city ? city : ''
    };
    this.handleDOBDateChange = this.handleDOBDateChange.bind(this);
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleWERemove = this.toggleWERemove.bind(this);
    this.handleWEDelete = this.handleWEDelete.bind(this);
    this.onShowAlert = this.onShowAlert.bind(this);
  }
 
  handleDOBDateChange(date) {
    this.setState({
      startDOBDate: date
    });
  }
 
  handleFromDateChange(date) {
    this.setState({
      startFromDate: date
    });
    if(this.state.workedTo < date) {
      this.setState({
        workedTo: date
      });
    }
  }
 
  handleToDateChange(date) {
    this.setState({
      workedTo: date
    });
    if(this.state.startFromDate > date) {
      this.setState({
        startFromDate: date
      });
    }
  }
 
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    });
    switch (e.target.id) {
      case "jobSeekerName":
        var element = e.target;
        if (element.validity.patternMismatch) {
          element.setCustomValidity("Name should not contain number and special characters");
          element.reportValidity();
        } else {
          element.setCustomValidity("");
        }
        break;
      default:
        break;
    }
  };
 
  handleSelectChange = function (e) {
    var options = e.target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    this.props.someCallback(value);
  }
 
  handleChangeFT = () => {
    this.setState(prevState => ({
      applyingFullTime: !prevState.applyingFullTime,
    }));
  }
 
  handleChangePT = () => {
    this.setState(prevState => ({
      applyingPartTime: !prevState.applyingPartTime,
    }));
  }
 
  handleChangeEU = () => {
    this.setState(prevState => ({
      euCitizen: !prevState.euCitizen,
    }));
  }
 
  handleOptionChange = (changeEvent) => {
    this.setState({
      prevWorkJobType: changeEvent.target.value
    });
  }
 
    handleSubmit = (e) => {
      e.preventDefault();
      //take the information from state that should be stored in DB (state contains more data than needed):
      var jobSeekerProfile = jobSeekerProfileEntity;
      if (this.state.jobSeekerName) {jobSeekerProfile.jobSeekerName    =  this.state.jobSeekerName; }
      if (this.state.jobSeekerEmail) {jobSeekerProfile.jobSeekerEmail    =  this.state.jobSeekerEmail; }
      if (this.state.jobSeekerPhone) {jobSeekerProfile.jobSeekerPhone  =  this.state.jobSeekerPhone;  }
        else { delete jobSeekerProfile.jobSeekerPhone }
      if (this.state.jobSeekerAddress) { jobSeekerProfile.jobSeekerAddress = this.state.jobSeekerAddress;}
      if (this.state.applyingFullTime) { jobSeekerProfile.applyingFullTime = true }
        else { jobSeekerProfile.applyingFullTime = false }
      if (this.state.applyingPartTime) { jobSeekerProfile.applyingPartTime = true }
      else { jobSeekerProfile.applyingPartTime = false }
      if (this.state.euCitizen) { jobSeekerProfile.euCitizen  = true }
        else { jobSeekerProfile.euCitizen  = false}  
      if (this.state.minSalary) {jobSeekerProfile.minSalary = this.state.minSalary;}
//      if (this.state.maxSalary) {jobSeekerProfile.maxSalary = this.state.maxSalary;}
      if (this.state.languages) {jobSeekerProfile.languages = this.state.languages;}
      if (this.state.skills) { jobSeekerProfile.skills = this.state.skills}
      if (this.state.startDOBDate) {jobSeekerProfile.DOBDate  =  this.state.startDOBDate;}
      if (this.state.city) {jobSeekerProfile.city  =  this.state.city;}
      if (this.state.education) {jobSeekerProfile.education = this.state.education;}
      if (this.state.workExperiences && this.state.workExperiences.length > 0) {
        var tmpWExps = [];
        for (var i = 0, l = this.state.workExperiences.length; i < l; i++) {
          var tmpExp = {
            companyName: null,
            jobDescription: null,
            jobTitle: null,
            jobType: null,
            startJobDate: null,
            endJobDate: null
          }
          if (this.state.workExperiences[i].companyName) {tmpExp.companyName = this.state.workExperiences[i].companyName}
          if (this.state.workExperiences[i].jobDescription) {tmpExp.jobDescription = this.state.workExperiences[i].jobDescription}
          if (this.state.workExperiences[i].jobTitle) {tmpExp.jobTitle = this.state.workExperiences[i].jobTitle}
          if (this.state.workExperiences[i].jobType) {tmpExp.jobType = this.state.workExperiences[i].jobType}
          if (this.state.workExperiences[i].startJobDate) {tmpExp.startJobDate = new Date(this.state.workExperiences[i].startJobDate)}
          if (this.state.workExperiences[i].endJobDate) {tmpExp.endJobDate = new Date(this.state.workExperiences[i].endJobDate)}
         
          if (i===0) {tmpWExps[0] = tmpExp; }
            else {tmpWExps =  [...tmpWExps,tmpExp]; }
 
        }
        if (tmpWExps.length>0) {jobSeekerProfile.workExperiences = tmpWExps}
 
      } else {jobSeekerProfile.workExperiences = null}
     
      this.props.editJobSeekerProfile(jobSeekerProfile);
      this.onShowAlert(); 
    }
 
  handleWExperienceSubmit = (e) => {
    this.toggle(1);
    e.preventDefault();
    if(e.target.we_id.value === '') {
      const newWExperience = {
        id: Math.random().toString(36).slice(2),
        companyName: e.target.company_name.value,
        jobTitle: e.target.job_title.value,
        startJobDate: e.target.working_from.value,
        endJobDate: e.target.worked_to.value,
        jobDescription: e.target.job_description.value,
        jobType: e.target.job_type.value,
      };
      newWExperience.companyName !== '' && this.setState({
        workExperiences: [...this.state.workExperiences, newWExperience]
      });
    } else {
      let updatedWorkExperiences = [...this.state.workExperiences];
      let experience = updatedWorkExperiences.find((exp) => exp.id === e.target.we_id.value);
      experience.companyName = e.target.company_name.value;
      experience.jobTitle = e.target.job_title.value;
      experience.startJobDate = e.target.working_from.value;
      experience.endJobDate = e.target.worked_to.value;
      experience.jobDescription = e.target.job_description.value;
      experience.jobType = e.target.job_type.value;
      experience.companyName !== '' && this.setState({
        workExperiences: updatedWorkExperiences
      });
    }
  }
 
  handleWEDelete() {
    let experience = this.state.workExperience;
    const newWorkExperiences = this.state.workExperiences.filter(workExperience => {
      return workExperience !== experience;
    });
 
    this.setState(prevState => ({
      workExperiences: [...newWorkExperiences],
      weRemoveModal: !prevState.weRemoveModal
    }));
  }
 
  onShowAlert = () => {
    this.setState({ visible: true }, () => {
      window.setTimeout(() => {
        this.setState({ visible: false });     
        this.props.history.push(ROUTES.JOBS);
      }, 1500)
    });
  }
 
  toggle(forceClose) {
    if(forceClose) {
      this.setState(prevState => ({
        modal: !prevState.modal,
        weCreate: true,
        weId: '',
        companyName: '',
        jobTitle: '',
        jobDescription: '',
        startFromDate: '',
        workedTo: ''
      }));
    } else {
      swal({
        text: "You are going to lose all the added information. Do you really want to close the modal?",
        icon: "warning",
        buttons: true,
        dangerMode: false
      }).then(close => {
        if (close) {
          this.setState(prevState => ({
            modal: !prevState.modal,
            weCreate: true,
            weId: '',
            companyName: '',
            jobTitle: '',
            jobDescription: '',
            startFromDate: '',
            workedTo: ''
          }));
        }
      }); 
    }
       
  }
 
  toggleWERemove(e, experience) {
    this.setState(prevState => ({
      weRemoveModal: !prevState.weRemoveModal,
      workExperience: experience
    }));
  }
 
  toggleModalWithData(e, exp, id) {
    var tsStartJobDate = "";
    var tsEndJobDate = "";
    if(typeof exp.startJobDate !== 'string') {
      tsStartJobDate = new Date(exp.startJobDate.seconds * 1000);
      tsStartJobDate = (tsStartJobDate.getMonth() + 1) + '/' + tsStartJobDate.getDate() + '/' + tsStartJobDate.getFullYear();
    } else {
      tsStartJobDate = exp.startJobDate;
    }
    if(typeof exp.endJobDate !== 'string') {
      tsEndJobDate = new Date(exp.endJobDate.seconds * 1000);
      tsEndJobDate = (tsEndJobDate.getMonth() + 1) + '/' + tsEndJobDate.getDate() + '/' + tsEndJobDate.getFullYear();
    } else {
      tsEndJobDate = exp.endJobDate;
    }
    if(e.target.id !== id){
      this.setState(prevState => ({
        modal: true,
        weCreate: false,
        weId: exp.id,
        companyName: exp.companyName,
        jobDescription: exp.jobDescription,
        jobTitle: exp.jobTitle,
        startFromDate: new Date(tsStartJobDate),
        workedTo: new Date(tsEndJobDate),
        prevWorkJobType: exp.jobType
      }));
    }
  }
 
  render() {
    const { auth, response, message, skillsList, locationList, educationList, languageList } = this.props;
    if (!auth.uid && !auth.emailVerified) return <Redirect to={ROUTES.LOG_IN} />;
    return (
      <div className="job-seeker-profile">
        <Alert color={response} isOpen={this.state.visible}><i className={response === 'success' ? "fas fa-check" : "fas fa-times"}></i> {message}</Alert>
        <Modal isOpen={this.state.modal} toggle={(e) => this.toggle(0)} className={this.props.className} backdrop="static">
          <ModalHeader toggle={(e) => this.toggle(0)}><i className="fas fa-info-circle text-warning"></i> {this.state.weCreate ? 'Add' : 'Edit'} work experience</ModalHeader>
          <ModalBody>
            <form className="work-experience-form text-info" onSubmit={this.handleWExperienceSubmit}>
              <div className="row">
                <div className="col-12">
                  <input id="we_id" type="hidden" name="we_id" value={this.state.weId} />
                  <div className="row">
                    <div className="col-md-6 col-12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="companyName"><i className="fas fa-file-signature"></i> Company name</label>
                        <input type="text" id="companyName" name="company_name" value={this.state.companyName} className="form-control form-control-lg" onChange={this.handleChange} 
                          placeholder="Career Tinder" required />
                      </div>
                    </div>
                    <div className="col-md-6 col-12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="jobTitle"><i className="fas fa-chalkboard-teacher"></i> Job title</label>
                        <input type="text" id="jobTitle" name="job_title" value={this.state.jobTitle} className="form-control form-control-lg" onChange={this.handleChange} 
                          placeholder="Software Engineer" required />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 col-12">
                      <div className="form-group datepicker">
                        <label className="form-label" htmlFor="jobTitle"><i className="fas fa-calendar-alt prefix"></i> From</label>
                        <DatePicker selected={this.state.startFromDate} onChange={this.handleFromDateChange} className="form-control form-control-lg"
                          peekNextMonth showMonthDropdown showYearDropdown dropdownMode="select" name="working_from" maxDate={new Date()} required />                        
                      </div>
                    </div>
                    <div className="col-md-6 col-12">
                      <div className="form-group datepicker">
                        <label className="form-label" htmlFor="jobTitle"><i className="fas fa-calendar-alt prefix"></i> To</label>
                        <DatePicker selected={this.state.workedTo} onChange={this.handleToDateChange} className="form-control form-control-lg"
                          peekNextMonth showMonthDropdown showYearDropdown dropdownMode="select" name="worked_to" maxDate={new Date()} />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label className="form-label" htmlFor="jobDescription"><i className="far fa-address-card"></i> Job description</label>
                        <textarea type="text" id="jobDescription" name="job_description" value={this.state.jobDescription} className="form-control form-control-lg" onChange={this.handleChange} 
                          rows="1" required />
                      </div>
                    </div>
                    <div className="col-12 mb-1">
                      <div className="form-inline">
                        <div className="form-group">
                          <label htmlFor="job_type" style={{'justifyContent':'left'}} className="mr-2"><i className="fas fa-map-marked-alt mr-2"></i> Job type while working there:</label>
                          <Radio name="job_type" shape="round" color="primary" animation="smooth"
                            value="Full-time" checked={this.state.prevWorkJobType === 'Full-time'}
                            onChange={this.handleOptionChange}>
                            Full-time
                          </Radio>
                          <Radio name="job_type" shape="round" color="primary" animation="smooth"
                            value="Part-time" checked={this.state.prevWorkJobType === 'Part-time'}
                            onChange={this.handleOptionChange}>
                            Part-time
                          </Radio>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <hr className="mt-4 mb-4" />
                  <Button color="success" type="submit"><i className={this.state.weCreate ? "fas fa-plus": "fas fa-edit"}></i> {this.state.weCreate ? 'Add' : 'Update'}</Button>{' '}
                  <Button color="danger" onClick={(e) => this.toggle(0)}>Cancel</Button>
                </div>
              </div>
            </form>
          </ModalBody>
        </Modal>
        <Modal isOpen={this.state.weRemoveModal} toggle={(e) => this.toggleWERemove(e, '')} className={this.props.className}>
          <ModalHeader toggle={(e) => this.toggleWERemove(e, '')}><i className="fas fa-info-circle text-warning"></i> Remove Work Experience</ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-12">
                Do you really want to remove this work experience from your job seeker profile?
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.handleWEDelete}><i className="fas fa-trash-alt"></i> Remove</Button>{' '}
            <Button color="primary" onClick={(e) => this.toggleWERemove(e, '')}>Cancel</Button>
          </ModalFooter>
        </Modal>
        <div className="profile-form-wrapper">
          <h3 className="text-center font-weight-bold mt-4">
            <i className="far fa-edit"></i><br/>
            Edit your Job Seeker profile
          </h3>
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              <form className="profile-form mb-4 mt-4" onSubmit={this.handleSubmit}>
                <div className="row">
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label className="form-label" htmlFor="jobSeekerName"><i className="fas fa-file-signature"></i> Name</label>
                      <input type="text" id="jobSeekerName" name="jobSeekerName" defaultValue={
                        this.props.jobseeker &&
                        this.props.jobseeker.jobSeekerName
                      } className="form-control form-control-lg" onChange={this.handleChange} 
                        placeholder="John Doe" maxLength="40" pattern="^[A-Za-z.\s_-]+$" required />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label className="form-label" htmlFor="jobSeekerPhone"><i className="fas fa-mobile-alt"></i> Phone</label>
                      <input type="text" id="jobSeekerPhone" name="jobSeekerPhone" 
                        defaultValue={
                          this.props.jobseeker &&
                          this.props.jobseeker.jobSeekerPhone
                        }
                       className="form-control form-control-lg" onChange={this.handleChange} 
                        placeholder="01234567899" required />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label" htmlFor="jobSeekerAddress"><i className="far fa-address-card"></i> Address</label>
                      <input type="text" id="jobSeekerAddress" name="jobSeekerAddress" defaultValue={
                        this.props.jobseeker &&
                        this.props.jobseeker.jobSeekerAddress
                      } className="form-control form-control-lg" onChange={this.handleChange} 
                        required/>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 col-12">
                    <div className="form-group datepicker">
                      <label className="form-label" htmlFor="dateOfBirth"><i className="far fa-calendar-alt"></i> Date of birth</label>
                      <DatePicker selected={this.state.startDOBDate || '' } id="dateOfBirth" onChange={this.handleDOBDateChange} className="form-control w-100"
                          peekNextMonth showMonthDropdown showYearDropdown dropdownMode="select" maxDate={new Date()} autoComplete="off" />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label><i className="fas fa-code"></i> Skills</label>
                      <CreatableSelect
                        id="employeeSkills"
                        value={this.state.skills}
                        onChange={this.handleSkillsChange}
                        options={skillsList}
                        isMulti={true}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label" htmlFor="education"><i className="far fa-address-card"></i> Education</label>
                      <Select
                          id="jobSeekerEducation"
                          value={this.state.education}
                          onChange={this.handleEducationChange}
                          options={educationList}
                          isMulti={false}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label><i className="fas fa-sign-language"></i> Languages</label>
                      <Select
                          id="employeeLanguage"
                          value={this.state.languages}
                          onChange={this.handleLanguagesChange}
                          options={languageList}
                          isMulti={true}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label><i className="fas fa-map-marker-alt"></i> City</label>
                      <Select
                          id="employeeCity"
                          value={this.state.city}
                          onChange={this.handleCityChange}
                          options={locationList}
                          isMulti={false}
                      />
                    </div>
                  </div>
                </div>             
                <div className="row">
                  <div className="col-12">                        
                    <div className="form-group">
                      <label className="work-experience-label"><i className="far fa-building"></i> Work Experiences</label>
                      <button type="button" className="btn btn-danger btn-circle" onClick={(e) => this.toggle(1)}><i className="fas fa-plus"></i></button>
                    </div>
                    <div className="row" id="work_experiences">
                      {
                        this.state.workExperiences && this.state.workExperiences.map((workExperience, i) => {
                          return (
                            <div key={`work-experience-${i}`} className="col-lg-3 col-md-4 col-12">
                              <div className="work-experiences-tag badge badge-info mb-2">
                                <div className="row">
                                  <div className="col-8 text-left">
                                    <span>{workExperience.companyName}</span>
                                  </div>
                                  <div className="col-4">
                                    <i id={"remove_we_"+i} className="fas fa-trash-alt ml-2 float-right" onClick={(e) => this.toggleWERemove(e, workExperience)}></i>
                                    <i id={"edit_we_"+i} onClick={(e) => this.toggleModalWithData(e, workExperience, "remove_we_"+i)} className="fas fa-edit float-right"></i>
                                  </div>
                                </div>  
                              </div>            
                            </div>                
                          )
                        })
                      }
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 col-12">
                    <div className="form-group mt-2">
                      <label htmlFor="euCitizen"><i className="fas fa-globe-europe"></i> EU Citizen</label>
                      <Checkbox icon={<i className="fas fa-check-double" />} animation="jelly"
                        shape="curve" color="primary-o" id="employeeCitizenship"
                        checked={this.state.euCitizen ? true : false} onChange={this.handleChangeEU}>
                            Are you an EU Citizen?
                      </Checkbox>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="form-group">
                      <label className="form-label" htmlFor="minSalary"><i className="fas fa-euro-sign"></i> Minimum expected salary(Euro)</label>
                      <input type="text" id="minSalary" name="minSalary" defaultValue={
                        this.props.jobseeker &&
                        this.props.jobseeker.minSalary
                      }  className="form-control form-control-lg" onChange={this.handleChange} 
                        placeholder="40000" required />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <label><i className="fas fa-map-marked-alt"></i> Interested in</label>
                      <Checkbox icon={<i className="fas fa-check-double" />} animation="jelly"
                        shape="curve" color="primary-o" id="employmentTypeFull"
                        checked={this.state.applyingFullTime ? true : false} onChange={this.handleChangeFT}>
                            Full-time
                      </Checkbox>
                      <Checkbox icon={<i className="fas fa-check-double" />} animation="jelly"
                        shape="curve" color="primary-o" id="employmentTypePart"
                        checked={this.state.applyingPartTime ? true : false} onChange={this.handleChangePT}>
                            Part-time
                      </Checkbox>
                    </div>                          
                  </div>                      
                </div>                    
                <div className="row">
                  <div className="col-12">
                    <button type="submit" className="btn btn-lg btn-info w-100 mt-4">
                      <i className="fas fa-save"></i> Save
                    </button> 
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
 
 
const mapStateToProps = state => {
  const jobseekers = state.firestore.data.jobseeker;
  const auth = state.firebase.auth;
  const jobseeker = jobseekers ? jobseekers[auth.uid] : null;

  var returnObject = {
    auth: auth,
    jobseeker: jobseeker,
    response: state.profile.response,
    message: state.profile.message
  };
  
  // code for fetching data from Skill-sets
  const skillsData = state.firestore.data.Skill;
  const locationData = state.firestore.data.city;
  const educationData = state.firestore.data.education;
  const languageData = state.firestore.data.language;

  if (skillsData && locationData && educationData && languageData ){
    var result = [];
    $.each(skillsData, function(index, item) {
      result.push({
        value: index,
        label: item.name
      });
    });
    returnObject.skillsList = result;
    //console.log(result);
  
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
    $.each(educationData, function(index, item) {
      result.push({
        value: index,
        label: item.name
      });
    });
    returnObject.educationList = result;

    result = [];
    $.each(languageData, function(index, item) {
      result.push({
        value: index,
        label: item.name
      });
    });
    returnObject.languageList = result;

  }
  return returnObject;
};
 
const mapDispatchToPropsJobseeker = dispatch => {
 
  return {
    editJobSeekerProfile: (profile) => dispatch(editJobSeekerProfile(profile))
  }
};
 
 
export default
  withRouter(compose(
    connect(mapStateToProps, mapDispatchToPropsJobseeker),
    firestoreConnect([
      {
        collection: "jobseeker"
      },   
      {  //we read from collections of education, skills and locations(cities) and languages
        collection: "Skill",
        orderBy: ["name", "asc"]
      },
      {
        collection: "city",
        orderBy: ["name", "asc"]
      },
      {
        collection: "education",
        orderBy: ["name", "asc"]
      },
      {  
        collection: "language",
        orderBy: ["name", "asc"]
      }
    ])  
  )(EditJobSeekerProfile));
