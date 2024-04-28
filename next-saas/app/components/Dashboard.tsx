import NextLink from "next/link";
import { Box, Button, Container, Section } from "@radix-ui/themes";
import Header from "./Header";
import { getSession } from "@auth0/nextjs-auth0";

export default async function Dashboard() {
  const { user } = await getSession();

  return (user && (
    <Box>
      <Header />
      <Section>
        <Container>
          <div>
            <img src={user.picture} alt={user.name} />
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
          <NextLink href="/generate">
            <Button size="2" color="ruby">Generate</Button>
          </NextLink>
        </Container>
      </Section>
    </Box>
  ));
}
