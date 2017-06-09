import keyMirror from 'keymirror';

const actionTypes = keyMirror({
  SIGN_UP: null,
  SIGN_UP_FALUIRE: null,
  SIGN_UP_SUCCESS: null,
  LOGIN: null,
  LOGIN_FALUIRE: null,
  LOGIN_SUCCESS: null,
  LOG_OUT: null,
  CREATE_DOCUMENT: null,
  CREATE_DOCUMENT_SUCCESS: null,
  CREATE_DOCUMENT_FALUIRE: null,
  GET_MY_DOCUMENTS_SUCCESS: null,
  GET_MY_DOCUMENTS_FAILURE: null,
  GET_MY_DOCUMENTS: null,
  GET_DOCUMENT: null,
  GET_DOCUMENT_SUCCESS: null,
  GET_DOCUMENT_FALUIRE: null,
  DELETE_DOCUMENT_SUCCESS: null,
  UPDATE_DOCUMENT: null,
  UPDATE_DOCUMENT_SUCCESS: null,
  UPDATE_DOCUMENT_FAILURE: null,
});
export default actionTypes;
