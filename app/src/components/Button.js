import React from "react";
import styled from "react-emotion";

import theme from "./../theme";
import { pxToRem } from "./../utils";

const Button = styled("button")`
  cursor: pointer;
  font-size: ${pxToRem(14)};
  font-weight: 700;
  padding: ${pxToRem(5)} ${pxToRem(15)};
  color: ${theme.primary};
  border: ${pxToRem(1)} solid ${theme.dark};
  border-radius: ${pxToRem(15)};
  background-color: white;
  border-color: ${props => (props.secondary ? theme.secondary : theme.light)};
`;
export default ({ className, primary, secondary, value, onClick }) => (
  <Button
    className={className}
    primary={primary}
    secondary={secondary}
    onClick={onClick}
  >
    {value}
  </Button>
);
