"use client";

import NextLink from "next/link";
import { Box, Grid, Text, Card, Badge, Button, Container, Section, Flex } from "@radix-ui/themes";
import Header from "./Header";
import { useUser } from "@auth0/nextjs-auth0/client";
import paths from "../../state";
import { useRouter } from "next/navigation";

function parseLevel(levelId: string) {
  if (levelId === "1") return "Beginner";
  if (levelId === "2") return "Intermediate";
  if (levelId === "3") return "Advanced";
  return "Beginner";
}

function parseMethods(methodIds: string[]) {
  let methods = [];

  if (methodIds.includes("1")) methods.push("Project Based");
  if (methodIds.includes("2")) methods.push("Courses");
  if (methodIds.includes("3")) methods.push("Books");
  if (methodIds.includes("4")) methods.push("Websites");

  return methods.map((method, index) => (
      <Badge key={index} color="grass">{method}</Badge>
  ));
}

export default function Dashboard() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  if (error) return <div>{error.message}</div>;
  if (!isLoading && !user) {
    router.push("/");
  }

  const pathComponents = paths.map((path, index) => (
    <Card key={index}>
      <Flex direction="column" gap="2">
        <Text size="6">{path.topic}</Text>
        <Badge color="ruby">{parseLevel(path.level)}</Badge>
        <Flex gap="2">
          {parseMethods(path.methods.split(","))}
        </Flex>
        <Text className="whitespace-pre-wrap">{path.path}</Text>
      </Flex>
    </Card>
  ));

  return (user && (
    <Box>
      <Header />
      <Section>
        <Container>
          <NextLink href="/generate">
            <Button size="2" color="ruby">Generate</Button>
          </NextLink>
          <Section>
            <Grid columns="3" gap="3" width="auto">
              {pathComponents}
            </Grid>
          </Section>
        </Container>
      </Section>
    </Box>
  ));
}
