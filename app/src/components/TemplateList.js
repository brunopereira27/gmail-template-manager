import React from "react";
import styled from "react-emotion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import theme from "./../theme";
import Template from "./Template";
import AddTemplate from "./AddTemplate";
import TemplateForm from "./TemplateForm";
import {
  fetchTemplates,
  setTemplateFormVisibility,
  createTemplateRequest,
  reorderTemplateRequest
} from "../actions";

class TemplateList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchTemplates());
  }

  showTemplateForm = () => {
    const { dispatch } = this.props;
    dispatch(setTemplateFormVisibility(true));
  };

  hideTemplateForm = () => {
    const { dispatch } = this.props;
    dispatch(setTemplateFormVisibility(false));
  };

  createTemplate = (event, name, content) => {
    event.preventDefault();
    const { dispatch, items } = this.props;
    const position =
      items.length > 0 ? Math.max(...items.map(item => item.position)) + 1 : 0;
    dispatch(createTemplateRequest(name, content, position));
  };

  insertTemplate = content => {
    window.parent.postMessage({ eventName: "InsertTemplate", content }, "*");
  };

  onDragEnd = result => {
    const { dispatch, items } = this.props;
    if (!result.destination) {
      return;
    }
    const oldPosition = result.source.index;
    const newPosition = result.destination.index;
    console.log("old pos", result.source);
    console.log("new pos", result.destination);
    console.log(items);
    dispatch(
      reorderTemplateRequest(
        items[oldPosition].template_id,
        oldPosition,
        newPosition
      )
    );
  };

  render() {
    const Container = styled("div")`
      padding: 10px;
    `;
    const NoTemplate = styled("span")`
      padding: 30px;
      font-weight: 700;
      color: ${theme.dark};
    `;

    const {
      error,
      items,
      isFetching,
      lastUpdated,
      templateFormVisibility
    } = this.props;

    if (templateFormVisibility) {
      return <TemplateForm onSubmit={this.createTemplate} />;
    }
    if (error) {
      return <div>Error: {error}</div>;
    } else if (isFetching) {
      return <div>Loading...</div>;
    } else if (items.length === 0) {
      return (
        <div>
          <NoTemplate>You don't have any template yet.</NoTemplate>
          <AddTemplate onClick={this.showTemplateForm} />
        </div>
      );
    } else {
      return (
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <Container innerRef={provided.innerRef}>
                {items.map((item, index) => (
                  <Draggable
                    key={item.template_id}
                    draggableId={item.template_id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <Template
                        innerRef={provided.innerRef}
                        provided={provided}
                        key={item.template_id}
                        {...item}
                        onClick={() => this.insertTemplate(item.content)}
                      />
                    )}
                  </Draggable>
                ))}

                <AddTemplate onClick={this.showTemplateForm} />
              </Container>
            )}
          </Droppable>
        </DragDropContext>
      );
    }
  }
}

TemplateList.propTypes = {
  items: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  error: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  templateFormVisibility: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  const { templates, templateFormVisibility } = state;
  const { isFetching, lastUpdated, items, error } = templates || {
    isFetching: true,
    items: []
  };
  const { visibility } = templateFormVisibility || { visiblity: false };
  return {
    isFetching,
    items,
    lastUpdated,
    error,
    templateFormVisibility: visibility
  };
}
export default connect(mapStateToProps)(TemplateList);
