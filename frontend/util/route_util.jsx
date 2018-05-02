import React from 'react';
import {withRouter} from 'react-router-dom';
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {updateMainPageMode} from '../actions/ui_actions';

const Auth = ({component: Component, path, loggedIn}) => {
  return (<Route path={path} render={(props) => {
      return loggedIn
        ? (<Redirect to="/@me"/>)
        : (<Component {...props}/>);
    }}/>);
};

class Protected extends React.Component {
  constructor(props) {
    super(props);
    this.handlePath(props);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.location.pathname !== this.props.location.pathname) this.handlePath(newProps);
  }

  handlePath(newProps) {
    const [path, mainPageMode, channelId] = this.processPath(newProps);
    if (newProps.location.pathname !== path){
      newProps.history.push(path);
    } else {
      newProps.updateMainPageMode({
        mainPageMode,
        channelId
      });
    }
  }

  processPath(newProps) {
    const [serverId, channelId] = getPathArray();
    if (serverId === '@me') {
      return newProps.dmList.includes(channelId)
        ? [`/@me/${channelId}`, 'DM', channelId]
        : ['/@me', 'friends_list', null];
    } else {
      return newProps.servers[serverId]
        ? newProps.servers[serverId].channelIds.includes(parseInt(channelId))
          ? [`/${serverId}/${channelId}`, serverId, channelId]
          : [
            `/${serverId}/${newProps.servers[serverId].channelIds[0]}`,
            serverId,
            newProps.servers[serverId].channelIds[0]
          ]
        : ['/@me', 'friends_list', null];
    }
    function getPathArray() {
      const pathArray = newProps.location.pathname.split('/').filter(el => el !== '');
      return !pathArray.length || pathArray.length > 2
        ? ['/@me']
        : pathArray;
    }
  }

  render() {
    const Component = this.props.component;
    return (<Route path={this.props.path} render={(props) => {
        return this.props.loggedIn
          ? (<Component {...props}/>)
          : (<Redirect to="/login"/>);
      }}/>);
  }
}

const authMapStateToProps = (state, ownProps) => {
  return {
    loggedIn: Boolean(state.session.currentUser),
  };
};

const protectedMapStateToProps = (state, ownProps) => {
  return {
    loggedIn: Boolean(state.session.currentUser),
    sessionPayloadReceived: state.ui.sessionPayloadReceived,
    dmList: Object.keys(state.entities.directMessages),
    servers: state.entities.servers,
  };
};

const protectedMapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateMainPageMode: (mainPageMode) => dispatch(updateMainPageMode(mainPageMode))
  };
};

export const AuthRoute = connect(authMapStateToProps, null)(Auth);
export const ProtectedRoute = withRouter(connect(protectedMapStateToProps, protectedMapDispatchToProps)(Protected));
