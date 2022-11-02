import styled from "styled-components";

interface TitleProps {
  big?: true;
}

export const Title = styled.h1<TitleProps>`
  margin: 0;
  line-height: 1.15;
  font-size: ${({ big }): string => (big ? "4rem" : "2rem")};
  text-align: center;
`;
