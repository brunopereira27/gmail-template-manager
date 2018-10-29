import React from "react";
import styled from "react-emotion";
import { dispatch } from "react-redux";

import { pxToRem } from "./../utils";
import theme from "./../theme";
import Button from "./../components/Button";

export default class AddTemplate extends React.Component {
  render() {
    return <Button onClick={this.props.onClick} value="Create Template" />;
  }
}
