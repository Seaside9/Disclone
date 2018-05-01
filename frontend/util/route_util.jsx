import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

const Auth = ({component: Component, path, loggedIn}) => {
  return (<Route path={path} render={(props) => {
      return loggedIn
        ? (<Redirect to="/@me"/>)
        : (<Component {...props}/>);
    }}/>);
};

const Protected = ({component: Component, path, loggedIn}) => {
  return (<Route path={path} render={(props) => {
      return loggedIn
        ? (<Component {...props}/>)
        : (<Redirect to="/login"/>);
    }}/>);
};

const mapStateToProps = (state, ownProps) => {
  return {
    loggedIn: Boolean(state.session.currentUser)
  };
};

export const AuthRoute = connect(mapStateToProps, null)(Auth);
export const ProtectedRoute = connect(mapStateToProps, null)(Protected);

export const processPath = (currentPath, dmList, servers) => {
  const [serverId, channelId] = getPathArray();
  if (serverId === '@me') {
    return dmList.includes(channelId)
      ? [`/@me/${channelId}`, 'DM', channelId]
      : ['/@me', 'friends_list', null];
  } else {
    return servers[serverId]
      ? servers[serverId].channelIds.includes(parseInt(channelId))
        ? [`/${serverId}/${channelId}`, serverId, channelId]
        : [
          `/${serverId}/${servers[serverId].channelIds[0]}`,
          serverId,
          servers[serverId].channelIds[0]
        ]
      : ['/@me', 'friends_list', null];
  }
  function getPathArray() {
    const pathArray = currentPath.split('/').filter(el => el !== '');
    return !pathArray.length || pathArray.length > 2
      ? ['/@me']
      : pathArray;
  }
};
