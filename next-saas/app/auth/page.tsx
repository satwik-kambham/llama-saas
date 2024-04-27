import NextLink from "next/link";
import { Box, Button, Container, Section, Flex, TextField, Card } from "@radix-ui/themes";
import Header from "../components/header";
import { PaperPlaneIcon } from "@radix-ui/react-icons";

export default function Home() {

  return (
    <Box>
      <Header />
      <Section>
        <Container size="1">
          <Card>
            <Flex direction="column" gap="4">
              <TextField.Root placeholder="Username / Email">
              </TextField.Root>
              <TextField.Root placeholder="Password">
              </TextField.Root>
              <Flex justify="end">
                <NextLink href="/dashboard">
                  <Button size="2" color="ruby">
                    Login
                    <PaperPlaneIcon />
                  </Button>
                </NextLink>
              </Flex>
            </Flex>
          </Card>
        </Container>
      </Section>
    </Box>
  );
}
