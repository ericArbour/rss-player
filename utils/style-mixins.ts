import { css } from "styled-components";

export const cardEffect = css`
  margin: 1rem;
  text-align: left;
  color: inherit;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  transition: color 0.15s ease, border-color 0.15s ease;

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
