import moment from 'moment';
import {
  ADD_QUERY_EDITOR,
  ADD_TABLE, REMOVE_TABLE,
  HIDE_TABLE_POPUP,
  REMOVE_QUERY_EDITOR,
  SHOW_TABLE_POPUP,
  START_QUERY,
  STOP_QUERY,
  QUERY_SUCCESS,
  QUERY_FAILED,
  EXPAND_TABLE,
  COLLAPSE_TABLE,
  QUERY_EDITOR_SETDB,
  QUERY_EDITOR_SET_TITLE,
  QUERY_EDITOR_SET_AUTORUN,
  SET_WORKSPACE_DB,
  ADD_WORKSPACE_QUERY,
  REMOVE_WORKSPACE_QUERY,
} from './actions';
import shortid from 'shortid';

const initialState = {
  queryEditors: [{
    id: shortid.generate(),
    title: "Query 1",
    sql: "SELECT *\nFROM\nWHERE",
    latestQueryId: null,
    autorun: false,
    dbId: null,
  }],
  queries: [],
  tables: [],
  workspaceQueries: [],
};

function alterInArr(state, arrKey, obj, alterations, idKey = 'id') {
  // Finds an item in an array in the state and replaces it with a
  // new object with an altered property
  var newArr = [];
  state[arrKey].forEach((arrItem) => {
    if (obj[idKey] === arrItem[idKey]) {
      var newObj = Object.assign({}, arrItem, alterations);
      newArr.push(newObj);
    } else {
      newArr.push(arrItem);
    }
  });
  var newState = {};
  newState[arrKey] = newArr;
  return Object.assign({}, state, newState);
}

function removeFromArr(state, arrKey, obj, idKey = 'id') {
  var newArr = [];
  state[arrKey].forEach((arrItem) => {
    if (!(obj[idKey] === arrItem[idKey])) {
      newArr.push(arrItem);
    }
  });
  var newState = {};
  newState[arrKey] = newArr;
  return Object.assign({}, state, newState);
}

function addToArr(state, arrKey, obj) {
  var newState = {};
  newState[arrKey] = [...state[arrKey], Object.assign({}, obj)];
  return Object.assign({}, state, newState);
}

function sqlAnvilReducer(state = initialState, action) {
  switch (action.type) {

    case ADD_QUERY_EDITOR:
      return addToArr(state, 'queryEditors', action.queryEditor);

    case REMOVE_QUERY_EDITOR:
      return removeFromArr(state, 'queryEditors', action.queryEditor);

    case ADD_TABLE:
      return addToArr(state, 'tables', action.table);

    case HIDE_TABLE_POPUP:
      return alterInArr(state, 'tables', action.table, {showPopup: false});

    case SHOW_TABLE_POPUP:
      return alterInArr(state, 'tables', action.table, {showPopup: true});

    case EXPAND_TABLE:
      return alterInArr(state, 'tables', action.table, {expanded: true});

    case COLLAPSE_TABLE:
      return alterInArr(state, 'tables', action.table, {expanded: false});

    case REMOVE_TABLE:
      return removeFromArr(state, 'tables', action.table);

    case START_QUERY:
      var state = addToArr(state, 'queries', action.query);
      state = alterInArr(state, 'queryEditors', {id: action.query.sqlEditorId}, {latestQueryId: action.query.id});
      return state;

    case STOP_QUERY:
      return alterInArr(state, 'queries', action.query, {state: 'stopped'});

    case QUERY_SUCCESS:
      var alts = {state: 'success', results: action.results, endDttm: moment()}
      return alterInArr(state, 'queries', action.query, alts);

    case QUERY_FAILED:
      var alts = {state: 'failed', 'msg': action.msg, endDttm: moment()}
      return alterInArr(state, 'queries', action.query, alts);

    case QUERY_EDITOR_SETDB:
      return alterInArr(state, 'queryEditors', action.queryEditor, {dbId: action.dbId});

    case QUERY_EDITOR_SET_TITLE:
      return alterInArr(state, 'queryEditors', action.queryEditor, {title: action.title});

    case QUERY_EDITOR_SET_AUTORUN:
      return alterInArr(state, 'queryEditors', action.queryEditor, {autorun: action.autorun});

    case SET_WORKSPACE_DB:
      return Object.assign({}, state, { workspaceDatabase: action.db })

    case ADD_WORKSPACE_QUERY:
      return addToArr(state, 'workspaceQueries', action.query);

    case REMOVE_WORKSPACE_QUERY:
      return removeFromArr(state, 'workspaceQueries', action.query);

    default:
      return state;
  }
}

export default sqlAnvilReducer;
