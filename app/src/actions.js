export const REQUEST_TEMPLATES = "REQUEST_TEMPLATES";
export function requestTemplates() {
  return {
    type: REQUEST_TEMPLATES
  };
}

export function fetchTemplates() {
  return function(dispatch) {
    dispatch(requestTemplates());

    return fetch(`http://localhost:8000/templates/`)
      .then(
        response => response.json(),
        error => console.log("An error occurred.", error)
      )
      .then(json => dispatch(receiveTemplates(json)));
  };
}

export const RECEIVE_TEMPLATES = "RECEIVE_TEMPLATES";
export function receiveTemplates(json) {
  return {
    type: RECEIVE_TEMPLATES,
    receivedAt: Date.now(),
    templates: json
  };
}

export const REQUEST_TEMPLATES_ERROR = "REQUEST_TEMPLATES_ERROR";
export function requestTemplatesError(error) {
  return {
    type: REQUEST_TEMPLATES,
    error
  };
}

export const REORDER_TEMPLATE = "REORDER_TEMPLATE";
export function reorderTemplate(oldPosition, newPosition) {
  return {
    type: REORDER_TEMPLATE,
    oldPosition,
    newPosition
  };
}

export function reorderTemplateRequest(templateId, oldPosition, newPosition) {
  return function(dispatch) {
    let data = new FormData();
    let headers = new Headers({
      "Content-Type": "application/json"
    });

    fetch(`http://localhost:8000/templates/${templateId}/position`, {
      method: "POST",
      body: JSON.stringify({ position: newPosition }),
      headers
    })
      .then(
        response => response.json(),
        error => console.log("An error occurred.", error)
      )
      .then(json => {
        dispatch(reorderTemplate(oldPosition, newPosition));
        dispatch(reorderTemplateOk());
      });
  };
}

export const REORDER_TEMPLATE_OK = "REORDER_TEMPLATE_OK";
export function reorderTemplateOk() {
  return {
    type: REORDER_TEMPLATE_OK
  };
}

export const REORDER_TEMPLATE_ERROR = "REORDER_TEMPLATE_ERROR";
export function reorderTemplateError() {
  return {
    type: REORDER_TEMPLATE_ERROR
  };
}

export const CREATE_TEMPLATE = "CREATE_TEMPLATE";
export function createTemplate(name, content, position) {
  return {
    type: CREATE_TEMPLATE
  };
}

export function createTemplateRequest(name, content, position) {
  return function(dispatch) {
    dispatch(createTemplate());

    let data = new FormData();
    let headers = new Headers({
      "Content-Type": "application/json"
    });

    fetch(`http://localhost:8000/templates/`, {
      method: "POST",
      body: JSON.stringify({ name, content, position }),
      headers
    })
      .then(
        response => response.json(),
        error => console.log("An error occurred.", error)
      )
      .then(json => {
        dispatch(setTemplateFormVisibility(false));
        dispatch(createTemplateOk());
        dispatch(fetchTemplates());
      });
  };
}

export const CREATE_TEMPLATE_OK = "CREATE_TEMPLATE_OK";
export function createTemplateOk() {
  return {
    type: CREATE_TEMPLATE_OK
  };
}

export const CREATE_TEMPLATE_ERROR = "CREATE_TEMPLATE_ERROR";
export function createTemplateError() {
  return {
    type: CREATE_TEMPLATE_ERROR
  };
}

export const SET_TEMPLATE_FORM_VISIBILITY = "SET_TEMPLATE_FORM_VISIBILITY";
export function setTemplateFormVisibility(visibility) {
  return {
    type: SET_TEMPLATE_FORM_VISIBILITY,
    visibility
  };
}
