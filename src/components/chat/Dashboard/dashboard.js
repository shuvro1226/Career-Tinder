import React from "react";
import * as ROUTES from "../../../constants/routes";
import NewChatComponent from "../NewChat/newChat";
import FileCenterComponent from "../FileSharing/fileSharing";
import Button from "@material-ui/core/Button";
import ChatListComponent from "../ChatList/chatList";
import ChatViewComponent from "../ChatView/chatView";
import ChatTextBoxComponent from "../ChatTextBox/chatTextBox";
import styles from "./styles";
import { withStyles } from "@material-ui/core";
const firebase = require("firebase");

// I need to investigate why sometimes
// two messages will send instead of just
// one. I dont know if there are two instances
// of the chat box component or what...

// I will be using both .then and async/await
// in this tutorial to give a feel of both.

class DashboardComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedChat: null,
      newChatFormVisible: false,
      email: null,
      friends: [],
      chats: [],
      redirectEmail: null,
      chatListOpen: false,
      fileDocKey: null,
      fileReceiver: null,
      fileCenterFormVisible: false
    };
  }
  componentDidMount = () => {
    if (this.props.location.state) {
      this.setState({
        newChatFormVisible: true,
        redirectEmail: this.props.location.state.email
      });
    }
  };

  openChatList = () => {
    this.setState({
      chatListOpen: !this.state.chatListOpen
    });
  };

  render() {
    if (this.state.email) {
      return (
        <div className="container page-wrapper" id="dashboard-container">
          <div className="row">
            <div className={this.state.chatListOpen ? "col-md-4 col-12 d-md-block": "col-md-4 col-12 d-md-block d-none"}>
              <ChatListComponent
                  history={this.props.history}
                  userEmail={this.state.email}
                  selectChatFn={this.selectChat}
                  chats={this.state.chats}
                  selectedChatIndex={this.state.selectedChat}
                  newChatBtnFn={this.newChatBtnClicked}
                />
            </div>
            <div className="col-md-8 col-12">      
              <div className={this.state.chatListOpen ? 'd-none': 'd-md-none'}>
                <button className="btn btn-info w-100 m-0 mt-2 mb-2" onClick={this.openChatList}>
                  <i className="fas fa-envelope-open-text"></i> Open chat list
                </button>
              </div>        
              {this.state.newChatFormVisible || this.state.fileCenterFormVisible ? null : (
                <ChatViewComponent
                  user={this.state.email}
                  chat={this.state.chats[this.state.selectedChat]}
                />
              )}
              {this.state.selectedChat !== null &&
              !this.state.newChatFormVisible &&
              !this.state.fileCenterFormVisible ? (
                <>
                  <ChatTextBoxComponent
                    userClickedInputFn={this.messageRead}
                    submitMessageFn={this.submitMessage}
                  />
                  <br></br>
                  <Button
                    variant="contained"
                    fullWidth
                    className="btn-info text-white"
                    onClick={this.fileCenterButClicked}
//                    className={classes.newChatBtn}
                  >
                    File Center...
                  </Button>
                  {console.log("fileCenterFormVisible1 ", this.state.fileCenterFormVisible )}
                </>
              ) : null}
              {/*start - file sharing*/}
              {this.state.selectedChat !== null &&
               this.state.fileCenterFormVisible ? (
                <FileCenterComponent
                //  redirectEmail={this.state.redirectEmail}
                  fileDocKey={this.state.fileDocKey}
                  fileSender={this.state.email}
                  fileReceiver={this.state.fileReceiver}
                //  goToChatFn={this.goToChat}
                //  newChatSubmitFn={this.newChatSubmit}
                />
              ) : null}
              {/*end - file sharing*/}
              {this.state.newChatFormVisible ? (
                <NewChatComponent
                  redirectEmail={this.state.redirectEmail}
                  goToChatFn={this.goToChat}
                  newChatSubmitFn={this.newChatSubmit}
                />
              ) : null}
            </div>
          </div>
        </div>
      );
    } else {
      return <div>LOADING....</div>;
    }
  }

  submitMessage = msg => {
    const docKey = this.buildDocKey(
      this.state.chats[this.state.selectedChat].users.filter(
        _usr => _usr !== this.state.email
      )[0]
    );
    firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          sender: this.state.email,
          message: msg,
          timestamp: Date.now()
        }),
        receiverHasRead: false
      });
  };

  // Always in alphabetical order:
  // 'user1:user2'
  buildDocKey = friend => [this.state.email, friend].sort().join(":");

  newChatBtnClicked = () => {
    this.setState({
      newChatFormVisible: true,
      selectedChat: null,
      fileCenterFormVisible: false,
      fileDocKey: null,
      fileReceiver: null,
      redirectEmail: "",
      chatListOpen: false
    });
  };

  fileCenterButClicked = () => {
    //const docKey = null; // this.buildDocKey(chatObj.sendTo);
    const fileReceiver = this.state.chats[this.state.selectedChat].users.filter(
      _usr => _usr !== this.state.email)[0];
    const fileDocKey = this.buildDocKey(fileReceiver);

    this.setState({
      fileCenterFormVisible: true,
      fileDocKey: fileDocKey,
      fileReceiver: fileReceiver
    });
  };

  newChatSubmit = async chatObj => {
    const docKey = this.buildDocKey(chatObj.sendTo);
    await firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .set({
        messages: [
          {
            message: chatObj.message,
            sender: this.state.email
          }
        ],
        users: [this.state.email, chatObj.sendTo],
        receiverHasRead: false
      });
    this.setState({ newChatFormVisible: false, chatListOpen: false });
    // this.selectChat(this.state.chats.length - 1); //commented to unselect any chat in new chat submit action
  };

  selectChat = async chatIndex => {
    await this.setState({ selectedChat: chatIndex, newChatFormVisible: false, chatListOpen: false });
    await this.setState({ fileCenterFormVisible: false });
    this.messageRead();
  };

  goToChat = async (docKey, msg) => {
    const usersInChat = docKey.split(":");
    const chat = this.state.chats.find(_chat =>
      usersInChat.every(_user => _chat.users.includes(_user))
    );
    this.setState({ newChatFormVisible: false, chatListOpen: false });
    await this.selectChat(this.state.chats.indexOf(chat));
    this.submitMessage(msg);
  };

  // Chat index could be different than the one we are currently on in the case
  // that we are calling this function from within a loop such as the chatList.
  // So we will set a default value and can overwrite it when necessary.
  messageRead = () => {
    const chatIndex = this.state.selectedChat;
    const docKey = this.buildDocKey(
      this.state.chats[chatIndex].users.filter(
        _usr => _usr !== this.state.email
      )[0]
    );
    if (this.clickedMessageWhereNotSender(chatIndex)) {
      firebase
        .firestore()
        .collection("chats")
        .doc(docKey)
        .update({ receiverHasRead: true });
    } else {
      console.log("Clicked message where the user was the sender");
    }
  };

  clickedMessageWhereNotSender = chatIndex =>
    this.state.chats[chatIndex].messages[
      this.state.chats[chatIndex].messages.length - 1
    ].sender !== this.state.email;

  componentWillMount = () => {
    firebase.auth().onAuthStateChanged(async _usr => {
      if (!_usr) this.props.history.push(ROUTES.LOG_IN);
      else {
        await firebase
          .firestore()
          .collection("chats")
          .where("users", "array-contains", _usr.email)
          .onSnapshot(async res => {
            const chats = res.docs.map(_doc => _doc.data());
            await this.setState({
              email: _usr.email,
              chats: chats,
              friends: []
            });
          });
      }
    });
  };
}

export default withStyles(styles)(DashboardComponent);
