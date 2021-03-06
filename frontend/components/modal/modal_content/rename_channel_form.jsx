import React from 'react';
import { connect } from 'react-redux';
import { updateChannel, receiveChannelError } from '../../../actions/channels_actions';

class RenameChannelForm extends React.Component {
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
    // let newName = inputArray[inputArray.length - 1];
    let newName = this.state.input;
    this.setState({
      input: ""
    });
    if (newName === ""){
      this.props.receiveChannelError("You need to enter valid channel name");
    } else if (newName.length >= 15) {
      this.props.receiveChannelError("channel name cannot be longer than 15 characters");
    } else {
      this.props.updateChannel(newName);
    }
  }

  render() {
    return(
      <form id='update-channel-form' onSubmit={this.submitForm} onClick={(e) => e.stopPropagation()}>
        <div className='form-title'>CHANGE CHANNEL NAME</div>
        <div className='form-sub-title'>You can change the channel name here.</div>
        <input className={`${this.props.errors !== ""}`} onChange={this.handleChange} value={this.state.input} placeholder='Enter new channel name'></input>
        <div className="error">{this.props.errors}</div>
      </form>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    modalVisible: state.ui.modalState,
    errors: state.errors.misc.channels
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {

  return {
    updateChannel: ( name) => dispatch(updateChannel(ownProps.channelId, name)),
    receiveChannelError: (string) => dispatch(receiveChannelError(string))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RenameChannelForm);
