export const REQUEST_TEMPLATES = "REQUEST_TEMPLATES";
export function requestTemplates() {
  return {
    type: REQUEST_TEMPLATES
  };
}

export function fetchTemplates(subreddit) {
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
export function reorderTemplate(templateId) {
  return {
    type: REORDER_TEMPLATE,
    templateId
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
    type: CREATE_TEMPLATE,
    template: { name, content, position }
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
