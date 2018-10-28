import React from "react";
import styled from "react-emotion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Template from "./Template";

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
    //fetch("./mocks/templates.json")
    //  .then(res => res.json())
    //  .then(
    //    result => {
    //      this.setState({
    //        isLoaded: true,
    //        remplates: result.items
    //      });
    //    },
    //    error => {
    //      this.setState({
    //        isLoaded: true,
    //        error
    //      });
    //    }
    //  );
    this.setState({
      isLoaded: true,
      templates: mock.results.templates
    });
  }

  insertTemplate(content) {
    console.log(content);
    window.parent.postMessage({ eventName: "InsertTemplate", content }, "*");
  }

  onDragEnd = result => {
    // dropped outside the list
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

    const { error, isLoaded, templates } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <Container innerRef={provided.innerRef}>
                {templates.map((template, index) => (
                  <Draggable
                    key={template.name}
                    draggableId={template.name}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <Template
                        innerRef={provided.innerRef}
                        provided={provided}
                        key={template.name}
                        {...template}
                        onClick={() => this.insertTemplate(template.content)}
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

export default TemplateList;
