import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import React from 'react';
import * as MessagesUtil from '../../../../util/messages_util';
import {submitMessage, fetchSnippet} from '../../../../actions/messages_actions';
import {toggleRead} from '../../../../actions/direct_messages_actions';
import MessagesWrapper from './messages/messages_wrapper';

class LiveChat extends React.Component {
  constructor(props){
    super(props);
    // ### TESTING ###
    this.state = {
      message: {
        author_id: props.currentUser.id,
        content: ""
      },
      messageable: {
        messageable: props.type,
        id: props.code
      }
    };
    // ### TESTING ###
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.processMessages = this.processMessages.bind(this);

    this.infRequested = false;
  }

  scrollToBottom() {
    this.messagesEnd.scrollIntoView();
  }

  componentDidMount() {
    if (this.props.type === 'DM' && this.props.unreadCount > 0){
      this.props.toggleRead(this.props.recipientId);
    }
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.type === 'DM' && newProps.unreadCount > 0){
      this.props.toggleRead(newProps.recipientId);
    }
    if (newProps.type !== this.props.type || newProps.code !== this.props.code){
      this.setState({
        message: {
          author_id: newProps.currentUser.id,
          content: ""
        },
        messageable: {
          messageable: newProps.type,
          id: newProps.code
        }
      });
    }
  }

  componentDidUpdate(prevProps) {

    // console.log('didReceivePropsCalled');
    // console.log(prevProps.messages);


    let newKeys = Object.keys(this.props.messages);
    let oldKeys = Object.keys(prevProps.messages);

    let oldHead = oldKeys[oldKeys.length - 1];
    let oldTail = oldKeys[0];

    let newHead = newKeys[newKeys.length - 1];
    let newTail = newKeys[0];

    // console.log('newTail: ' + newTail);
    // console.log('oldTail: ' + oldTail);
    if (newTail !== oldTail) {
      this.infRequested = false;
      // console.log(this.infRequested);
      this.scroller.scrollTop = (this.scroller.scrollHeight - this.prevScrollPos) + this.scroller.scrollTop;
    }
    if (newHead !== oldHead) {
      if (this.scrolledAtBottom || Boolean(!oldHead)){ //TODO: OR WHEN PAGE HAS CHANGED
        this.scrollToBottom();
      }
    }
  }

  handleChange(e) {
    this.setState({
      message: {
        author_id: this.props.currentUser.id,
        content: e.target.value
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.scrollToBottom();
    this.props.submitMessage(this.state);
    this.setState({
      message: {
        author_id: this.props.currentUser.id,
        content: ""
      }
    });
  }

  handleScroll(e) {
    this.prevScrollPos = this.scroller.scrollHeight;
    window.scrollDiv = e.target;
    this.scrolledAtBottom = (e.target.scrollTop >= (e.target.scrollHeight - e.target.offsetHeight));

    if ((e.target.scrollTop === 0) && !this.infRequested) {
      // testing
      this.props.fetchSnippet({
        messageable_type: this.props.type,
        messageable_id: this.props.code,
        msg_id: Object.keys(this.props.messages)[0],
        req_count: 10
      });
      // testing
      this.infRequested = true;
    }
  }

  processMessages() {
    let messages = Object.values(this.props.messages).reverse();
    let messagesWrappers = [];
    if (messages.length > 0){
      let messagesArray = [messages[0]];
      for (let i = 1; i < messages.length; i++){
        if (MessagesUtil.messagesShouldBreak(messages[i - 1], messages[i])){
          messagesWrappers.push(
            <MessagesWrapper
              key={i}
              messages={messagesArray.reverse()}
              showDate={MessagesUtil.showDate(messages[i - 1], messages[i])}
            />);
          messagesArray = [messages[i]];
        } else {
          messagesArray.push(messages[i]);
        }
      }
      messagesWrappers.push(
        <MessagesWrapper
          key={messages.length}
          messages={messagesArray.reverse()}
          showDate={true}
        />);
    }
    return messagesWrappers.reverse();
  }


  render(){
    return (
      <div className="live-chat dm">
        <div onScroll={this.handleScroll}
          className="scrollable"
          ref={(el) => {this.scroller = el;}}>
          <div className="holder">
            {this.processMessages()}
            <div style={{ float:"left", clear: "both" }}
              ref={(el) => { this.messagesEnd = el; }}/>
          </div>
        </div>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text" onChange={this.handleChange}
            value={this.state.message.content}
            placeholder="Message" />
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let messages = {};
  if (ownProps.type === 'DM'){
    state.entities.directMessages[ownProps.code].messages.forEach((id) => {
      messages[id] = state.entities.messages[id];
    });
  } else {
    // TODO: Handle Channel
  }
  return {
    currentUser: state.session.currentUser,
    messages: messages,
    unreadCount: state.entities.directMessages[ownProps.code].unreadCount,
    recipientId: state.entities.directMessages[ownProps.code].recipientId,
    currentPath: ownProps.location.pathname
  };
};

const mapDispatchToProps = (dispatch, ownState) => {
  return {
    submitMessage: (data) => dispatch(submitMessage(data)),
    fetchSnippet: (data) => dispatch(fetchSnippet(data)),
    toggleRead: (targetId) => dispatch(toggleRead(targetId))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LiveChat)
);
