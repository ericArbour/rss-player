import styled from "styled-components";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Button } from "./button";
import { Title } from "./title";

interface SignedInHeaderProps {
  session: Session;
}

export function SignedInHeader({ session }: SignedInHeaderProps): JSX.Element {
  return (
    <Header>
      <Title>RSS Player</Title>
      <UserControls>
        <p>Hello {session.user.email}!</p>
        <Button onClick={(): Promise<undefined> => signOut()}>Sign out</Button>
      </UserControls>
    </Header>
  );
}

const Header = styled.header`
  width: 100%;
  display: flex;
  border-bottom: 1px solid #eaeaea;
  justify-content: space-between;
  align-items: center;
`;

const UserControls = styled.span`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
