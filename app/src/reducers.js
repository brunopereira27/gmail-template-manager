import { combineReducers } from "redux";
import {
  REQUEST_TEMPLATES,
  RECEIVE_TEMPLATES,
  REQUEST_TEMPLATES_ERROR,
  REORDER_TEMPLATE,
  SET_TEMPLATE_FORM_VISIBILITY
} from "./actions";

/**
 * Utils function to reorder a list.
 * It moves element at startIndex to endIndex.
 * @params list: The list you want to reorder
 * @params startIndex: Index of the element to move
 * @params endIndex: Index of destination
 * @returns The list ordered.
 */
const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

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
    case REORDER_TEMPLATE:
      console.log(action);
      return Object.assign({}, state, {
        items: reorder(state.items, action.oldPosition, action.newPosition)
      });
    default:
      return state;
  }
}

function templateFormVisibility(
  state = {
    visibility: false
  },
  action
) {
  switch (action.type) {
    case SET_TEMPLATE_FORM_VISIBILITY:
      return Object.assign({}, state, {
        visibility: action.visibility
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  templates,
  templateFormVisibility
});

export default rootReducer;
