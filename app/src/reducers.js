import { combineReducers } from "redux";
import {
  REQUEST_TEMPLATES,
  RECEIVE_TEMPLATES,
  REQUEST_TEMPLATES_ERROR
} from "./actions";

function templates(
  state = {
    isFetching: false,
    didInvalidate: false,
    items: [],
    error: ""
  },
  action
) {
  switch (action.type) {
    case REQUEST_TEMPLATES:
      return Object.assign({}, state, {
        isFetching: true
      });
    case RECEIVE_TEMPLATES:
      console.log("hellworld", action);
      return Object.assign({}, state, {
        isFetching: false,
        items: action.templates,
        lastUpdated: action.receivedAt,
        error: ""
      });
    case REQUEST_TEMPLATES_ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        items: [],
        error: action.error
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  templates
});

export default rootReducer;
