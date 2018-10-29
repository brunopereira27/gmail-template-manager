import React from "react";
import styled from "react-emotion";
import { css } from "emotion";
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
    const className = css({
      backgroundColor: "#fff",
      borderRadius: "4px",
      border: "1px solid transparent",
      borderColor: "#209cee",
      color: "${theme.dark}",
      boxShadow: "inset 0 1px 2px rgba(10, 10, 10, 0.1)",
      maxWidth: "100%",
      width: "100%",
      lineHeight: "1.5",
      paddingBottom: "calc(0.375em - 1px)",
      paddingLeft: "calc(0.625em - 1px)",
      paddingRight: "calc(0.625em - 1px)",
      paddingTop: "calc(0.375em - 1px)",
      marginTop: "20px"
    });
    const H2 = styled("h2")`
      color: ${theme.primary};
    `;
    return (
      <form
        onSubmit={e =>
          this.props.onSubmit(e, this.state.name, this.state.content)
        }
      >
        <H2>Create your template</H2>
        <input
          placeholder="Template name"
          name="name"
          type="text"
          value={this.state.name}
          onChange={this.handleInputChange}
          className={className}
        />
        <textarea
          placeholder="Write here content of your template"
          name="content"
          value={this.state.content}
          onChange={this.handleInputChange}
          className={className}
        />
        <Button type="submit" value="Submit" />
      </form>
    );
  }
}
