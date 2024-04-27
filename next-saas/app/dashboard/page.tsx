import NextLink from "next/link";
import { Box, Button, Container, Section } from "@radix-ui/themes";
import Header from "../components/header";

export default function Home() {

  return (
    <Box>
      <Header />
      <Section>
        <Container>
          <NextLink href="/generate">
            <Button size="2" color="ruby">Generate</Button>
          </NextLink>
        </Container>
      </Section>
    </Box>
  );
}
