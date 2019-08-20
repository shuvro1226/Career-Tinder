import React from "react";
import {
 
  Button,
  withStyles,
  Typography

} from "@material-ui/core";
import styles from "./styles";
import firebase from "../../../config/firebaseConfig";
import * as ROUTES from "../../../constants/routes";
import ReactMoment from "react-moment";



class FileCenterComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      fileURL: '',
      progress: 0,
      fileList: [],
      chatID: this.props.fileDocKey,
      fileSender: this.props.fileSender,
      fileReceiver: this.props.fileReceiver
    }
    this.handleChange = this
      .handleChange
      .bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.handleDowload = this.handleDowload.bind(this);

  }

  handleChange = event => {
    this.setState({
      progress: 0,
      fileURL: '',
    });
    if (event.target.files[0]) {
      const file = event.target.files[0];
      this.setState(() => ({ file }));
    }
  }
  
  handleDowload = fileName => {
    firebase.storage().ref(`exchange_files/`).child(fileName)
        .getDownloadURL()
        .then(function(url) {
          // This can be downloaded directly:
          window.open(url, "_blank");

      }).catch(function(error) {
        console.log("error ",error)
        // Handle any errors
      });
  }

  handleShare = () => {
    const { file } = this.state;
    const storage = firebase.storage();

    const fileName = new Date().toISOString().slice(0,10) + 
                            "_" + Math.floor(Math.random() * 90 + 10) +
                            "_" + file.name ;
    const uploadTask = storage.ref(`exchange_files/` + fileName).put(file);
    uploadTask.on('state_changed',
      (snapshot) => {
        // progrss function ....
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        this.setState({ progress });
      },
      (error) => {
        // error function ....
        console.log(error);
      },
      () => {
        // we instert a record in collection fileSharing
        firebase
        .firestore()
        .collection("fileSharing")
        .add({
            chatID: this.state.chatID,
            senderID: this.state.fileSender,
            receiverID: this.state.fileReceiver,   //this has to changed to file receiver userId
            fileName: fileName,
            createdAt: new Date()
          });
        // Upload completed successfully, now we can get the download fileURL
        storage.ref(`exchange_files/`).child(fileName).getDownloadURL().then((fileURL) => {
          //console.log('File available at', fileURL);
          this.setState({ fileURL });
        });
      });
  }


  componentDidMount = () => {
    if (this.props.redirectEmail) {
      this.setState({
        username: this.props.redirectEmail
      });
    }
  };

  componentWillReceiveProps = nextProps => {
    this.setState({ username: nextProps.redirectEmail });
  };
  render() {
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <div className={classes.chatHeader}>
            Share files with {this.props.fileReceiver}
        </div>
        <div className={classes.paper}>
          <h3 className="text-center font-weight-bold mt-4">
            <i className="fas fa-link" />
            <br />
            File Center
          </h3>
          <div className="row">
            <div className="col-12">
              <input type="file" 
                name="file"
                className="form-control"
                onChange={this.handleChange} />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                className={classes.submit}
                onClick={this.handleShare}
              >
                <i className="fas fa-exchange-alt" />{" "} Share File
              </Button>
              <progress className="w-100" value={this.state.progress} max="100" />
              <br />
              {this.state.fileURL && <h6><b>File uploaded successfully</b></h6>}
              <br />
            </div>
          </div>
          {this.state.fileList.length > 0 ?
            <div className={classes.chatHeader}>
              Previuosly shared files
            </div> 
            : null
          }
          {/* table to show previously shared files*/}
          <table className="table">
          {this.state.fileList.length > 0 ?
              <tr className="tr">
                <th className="th"><b>File</b></th>
                <th className="th"><b>Date</b></th>
                <th className="th"><b>Sent/Recv</b></th>
                <th className="th"><b>Download</b></th>
              </tr>
            : null
          }
          { this.state.fileList.length > 0 ? (
              this.state.fileList.map((_file, _index) => { 
                const fileName = _file.fileName.slice(14);
                return(
                  <tr className="tr">
                    <th className="th">{fileName}</th>
                    <th className="th">{_file.createdAt &&
                          _file.createdAt.toDate().toLocaleString() ? (
                            <ReactMoment format="MMM DD, YYYY">
                              {_file.createdAt.toDate().toLocaleString()}
                            </ReactMoment>
                          ) : ( <i className="fas fa-ban text-muted" />  )
                        }</th>
                    <th className="th">{_file.senderID === this.state.fileSender ? " Sent" : " Received" }</th>
                    <th className="th">
                      <Button
                        //fullWidth
                        variant="contained"
                        color="primary"
                        //type="submit"
                       // className={classes.submit}
                       // onClick={this.handleDowload} 
                        onClick={() => this.handleDowload(_file.fileName ? _file.fileName : "")}
                      > <i className="fas fa-file-download" />
                      </Button>
                    </th>
                  </tr>
                );                
              })
              ) 
            : null }
          </table>

          {this.state.serverError ? (
            <Typography
              component="h5"
              variant="h6"
              className={classes.errorText}
            >
              Unable to locate the user
            </Typography>
          ) : null}
        </div>
      </main>
    );
  }

//  componentWillMount() {
//    if (!firebase.auth().currentUser) this.props.history.push("/login");
//  }

  componentWillMount = () => {
    firebase.auth().onAuthStateChanged(async _usr => {
      if (!_usr) this.props.history.push(ROUTES.LOG_IN);
      else {
        await firebase
          .firestore()
          .collection("fileSharing")
          .where("chatID", "==", this.props.fileDocKey)
          .orderBy("createdAt","desc")
          .onSnapshot(async res => {
            const files = res.docs.map(_doc => _doc.data());
            await this.setState({
              fileList: files
            });
       //    console.log("fileList ", this.state.fileList)
       //     console.log("fileURLList ", fileURLList)
          },
          (error) => {
            // error function ....
            console.log(error);
          }
          );
      }
    });
  };
}

export default withStyles(styles)(FileCenterComponent);
