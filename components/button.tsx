import styled from "styled-components";

export const Button = styled.button`
  background-color: black;
  font-size: 1em;
  padding: 0.25em 1em;
  border: 1px solid #eaeaea;
  border-radius: 3px;

  &:hover,
  &:focus,
  &:active {
    color: #0070f3;
    border-color: #0070f3;
  }

  @media (prefers-color-scheme: dark) {
    border-color: #222;
  }
`;
