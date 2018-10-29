import React from "react";
import styled from "react-emotion";
import { dispatch } from "react-redux";

import { pxToRem } from "./../utils";
import theme from "./../theme";
import Button from "./../components/Button";

export default class TemplateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      content: ""
    };
  }

  handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  render() {
    return (
      <form
        onSubmit={e =>
          this.props.onSubmit(e, this.state.name, this.state.content)
        }
      >
        <label>
          Name:
          <input
            name="name"
            type="text"
            value={this.state.name}
            onChange={this.handleInputChange}
          />
        </label>
        <label>
          Content:
          <textarea
            name="content"
            value={this.state.content}
            onChange={this.handleInputChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
