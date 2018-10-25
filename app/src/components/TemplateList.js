import React, { Component } from "react";
import styled from "react-emotion";

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
        <Container>
          {templates.map(template => (
            <Template
              {...template}
              key={template.name}
              onClick={() => this.insertTemplate(template.content)}
            />
          ))}
        </Container>
      );
    }
  }
}

export default TemplateList;
