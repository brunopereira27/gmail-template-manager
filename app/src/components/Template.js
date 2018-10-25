import React from "react";
import styled from "react-emotion";

import { pxToRem } from "./../utils";
import theme from "./../theme";
import Button from "./../components/Button";

const Template = props => {
  const Container = styled("div")`
    color: ${theme.dark};
    display: flex;
    justify-content: space-between;
    border: ${pxToRem(1)} solid ${theme.light};
    border-radius: 5px;
    margin: 0.8rem;
    padding: 0.8rem;
    cursor: pointer;
  `;
  const ActionButton = styled(Button)`
    margin: 0px ${pxToRem(10)};
  `;
  return (
    <Container>
      <span>{props.name}</span>
      <div>
        <ActionButton primary onClick={props.onClick} value="Use" />
        <ActionButton primary value="Preview" />
      </div>
    </Container>
  );
};

export default Template;
