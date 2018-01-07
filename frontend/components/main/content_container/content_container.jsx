import React from 'react';
import LiveChat from './live_chat/live_chat';
import FriendsList from './friends_list/friends_list';

class ContentContainer extends React.Component {
  constructor(props){
    super(props);
    this.processContent(this.props.mode, this.props.messageableId);
  }

  componentWillMount(){

  }

  componentWillReceiveProps(newProps){
    this.processContent(newProps.mode, newProps.messageableId);

  }

  processContent(mode, messageableId) {
    switch(mode) {
      case 'friends_list':
        this.content = <FriendsList />;
        break;
      case 'DM':
        this.content = <LiveChat type='DM' messageableId={messageableId} />;
        break;
      default:
        this.content = <div></div>;
    }
  }

  render(){
    return (
      <div className="content-container">
        <div className="head"></div>
        {this.content}
      </div>
    );
  }
}

export default ContentContainer;
