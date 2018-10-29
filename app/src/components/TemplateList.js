import React from "react";
import styled from "react-emotion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import theme from "./../theme";
import Template from "./Template";
import { fetchTemplates } from "../actions";

const mock = {
  results: {
    templates: [
      { name: "Presentation", content: "HelloWorld, I'm..." },
      { name: "Got it", content: "HelloWorld; GOTCHA" },
      { name: "Thanks", content: "HelloWorld,TY :pray:" }
    ]
  }
};

const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

class TemplateList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      templates: []
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchTemplates());
  }

  insertTemplate(content) {
    console.log(content);
    window.parent.postMessage({ eventName: "InsertTemplate", content }, "*");
  }

  onDragEnd = result => {
    if (!result.destination) {
      return;
    }

    const templates = reorder(
      this.state.templates,
      result.source.index,
      result.destination.index
    );

    this.setState({
      templates
    });
    console.log(templates);
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

    const { error, items, isFetching, lastUpdated } = this.props;

    if (error) {
      return <div>Error: {error}</div>;
    } else if (isFetching) {
      return <div>Loading...</div>;
    } else if (items.length === 0) {
      return <NoTemplate>You don't have any template yet.</NoTemplate>;
    } else {
      return (
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <Container innerRef={provided.innerRef}>
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <Template
                        innerRef={provided.innerRef}
                        provided={provided}
                        key={item.id}
                        {...item}
                        onClick={() => this.insertTemplate(item.content)}
                      />
                    )}
                  </Draggable>
                ))}
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
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const { templates } = state;
  const { isFetching, lastUpdated, items, error } = templates || {
    isFetching: true,
    items: []
  };
  return {
    isFetching,
    items,
    lastUpdated,
    error
  };
}
export default connect(mapStateToProps)(TemplateList);
