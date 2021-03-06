import React from 'react';
import { connect } from 'react-redux';
import { createFriendship, receiveFriendsError } from '../../../actions/friends_actions';

class AddFriendForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      input: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  handleChange(e) {
    this.setState({
      input: e.target.value
    });
  }

  submitForm(e) {
    e.preventDefault();
    let inputArray = this.state.input.split('#');
    let friendId = inputArray[inputArray.length - 1];
    this.setState({
      input: ""
    });
    if (friendId === "" || isNaN(friendId)){
      this.props.receiveFriendsError("You need to include user id");
    } else {
      this.props.createFriendship(friendId);
    }
  }

  render() {
    return(
      <form id='create-friendship-form' onSubmit={this.submitForm} onClick={(e) => e.stopPropagation()}>
        <div className='form-title'>ADD FRIEND</div>
        <div className='form-sub-title'>You can add a friend with their DiscloneTag</div>
        <input className={`${this.props.errors !== ""}`} onChange={this.handleChange} value={this.state.input} placeholder='Enter DiscloneTag#0000'></input>
        <div className="error">{this.props.errors}</div>
      </form>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    modalVisible: state.ui.modalState,
    errors: state.errors.misc.friends
  };
};

const mapDispatchToProps = (dispatch, ownState) => {

  return {
    createFriendship: (friendId) => dispatch(createFriendship(friendId)),
    receiveFriendsError: (string) => dispatch(receiveFriendsError(string))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddFriendForm);
