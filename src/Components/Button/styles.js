import styled from "styled-components";

export const Container = styled.button`
  display: inline-block;

  width: ${(props) => props.width};
  height: ${(props) => props.height};

  margin: 1em;
  padding: 0.25em 1em;

  border-width: 0px;
  border-radius: 10px;

  color: #ffffff;
  font-weight: bold;
  font-size: 1em;

  text-align: center;
  justify-content: center;

  background-color: ${(props) => props.backgroundColor};

  &:hover {
    background-color: ${(props) => props.hoverColor};
  }
`;
