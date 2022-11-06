import styled from "styled-components";

interface MainProps {
  centerVertically?: true;
}

export const Main = styled.main<MainProps>`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: ${({ centerVertically }): string =>
    centerVertically ? "center" : "flex-start"};
  align-items: center;
`;
