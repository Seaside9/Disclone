export const TOGGLE_MODAL = 'TOGGLE_MODAL';
export const TOGGLE_DROPDOWN = 'TOGGLE_DROPDOWN';
export const TOGGLE_INF_REQ = 'TOGGLE_INF_REQ';
export const UPDATE_MAIN_PAGE_MODE = 'UPDATE_MAIN_PAGE_MODE';
export const UPDATE_FRIENDLIST_MODE = 'UPDATE_FRIENDLIST_MODE';

export const toggleModal = (modalState, modalMode) => {
  return {
    type: TOGGLE_MODAL,
    modalState,
    modalMode
  };
};

export const toggleDropdown = (dropdownOn) => {
  return {
    type: TOGGLE_DROPDOWN,
    dropdownOn
  };
};

export const toggleInfReq = (infReq) => {
  return {
    type: TOGGLE_INF_REQ,
    infReq
  };
};

export const updateMainPageMode = ({serverId, messageableId}) => {
  return {
    type: UPDATE_MAIN_PAGE_MODE,
    serverId,
    messageableId
  };
};

export const updateFriendListMode = friendListMode => {
  return {
    type: UPDATE_FRIENDLIST_MODE,
    friendListMode
  };
};
