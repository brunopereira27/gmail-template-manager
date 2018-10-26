import React from "react";
import styled from "react-emotion";

import { pxToRem } from "./../utils";
import theme from "./../theme";
import Button from "./../components/Button";

export default class Template extends React.Component {
  render() {
    const Container = styled("div")`
      color: ${theme.dark};
      display: flex;
      justify-content: space-between;
      border: ${pxToRem(1)} solid ${theme.light};
      border-radius: 5px;
      margin: 0.8rem;
      padding: 0.8rem;
      cursor: move;
    `;
    const ActionButton = styled(Button)`
      margin: 0px ${pxToRem(10)};
    `;
    const { provided, innerRef, name, onClick } = this.props;
    return (
      <Container
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        innerRef={innerRef}
      >
        <span>{name}</span>
        <div>
          <ActionButton primary onClick={onClick} value="Use" />
        </div>
      </Container>
    );
  }
}
