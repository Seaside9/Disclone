import React from 'react';
import DmList from './dm_list';
import ChannelList from './channel_list';
import {toggleModal, toggleDropdown} from '../../../../actions/ui_actions';
import {connect} from 'react-redux';

const SubNavHeader = props => {
  return isNaN(props.serverId)
    ? (<div className="head" onClick={props.toggleAddDmModal}>
        <div className="findButton">Find or start a conversation</div>
      </div>)
    : (<div className={props.headClass}
        onClick={props.dropdownState ? props.toggleClearDropdown : props.toggleHeadDropdown}>
        <div className="name">{props.serverName}</div>
        <img className={props.headIndicatorClass} src={props.headIndicatorImg} alt=""/>
      </div>);
};

const mapStateToProps = (state, ownProps) => {
  return {
    serverId: state.ui.serverId,
    dropdownState: state.ui.dropdownState,
    headClass: state.ui.dropdownState ? 'head' : 'head open',
    headIndicatorClass: state.ui.dropdownState ? 'indicator' : 'indicator open',
    headIndicatorImg: state.ui.dropdownState
      ?  window.staticImages.arrowIcon : window.staticImages.closeIcon,
    serverName: isNaN(state.ui.serverId)
      ? null : state.entities.servers[state.ui.serverId].name
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    toggleAddDmModal: () => dispatch(toggleModal(true, 'addDmForm')),
    toggleHeadDropdown: (e) => {
      e.stopPropagation();
      dispatch(toggleDropdown(true));
    },
    toggleClearDropdown: (e) => {
      e.stopPropagation();
      dispatch(toggleDropdown(false));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SubNavHeader);
