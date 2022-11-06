import styled, { keyframes } from "styled-components";

const shine = keyframes`
  to {
    background-position-x: -200%;
  }
`;

export const Loading = styled.div`
  flex-grow: 1;
  max-width: 50rem;
  width: 100%;
  background: #0e0e0e;
  background: linear-gradient(90deg, #0c0c0c 8%, #1c1c1c 18%, #0c0c0c 33%);
  background-size: 200% 100%;
  box-shadow: inset 0px 0px 20px 20px black;
  animation: 1s ${shine} linear infinite;
`;
