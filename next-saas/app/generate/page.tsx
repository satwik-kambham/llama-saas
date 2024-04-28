"use client";

import { useState } from "react";
import NextLink from "next/link";
import { Box, Container, Text, IconButton, ScrollArea, Section, TextField, Card, Button, Flex, Skeleton, DataList } from "@radix-ui/themes";
import Header from "../components/Header";
import { ArrowLeftIcon, PaperPlaneIcon, Pencil2Icon, TextAlignLeftIcon } from "@radix-ui/react-icons";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";

async function generateResponse(prompt: string) {
  const url = "http://localhost:11434/api/generate";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3",
      prompt: prompt,
    }),
  });

  const stream = res.body;

  return stream;
}

export default function Generate() {
  const { user, error, isLoading } = useUser();
  const [response, setResponse] = useState("");
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  async function infer() {
    setResponse("");
    const stream = await generateResponse(prompt);
    let response = "";
    if (stream) {
      for await (const chunk of stream) {
        const chunkStr = new TextDecoder().decode(chunk);
        const jsonData = JSON.parse(chunkStr);
        response += jsonData.response;
        setResponse(response);
      }
    }
  }

  if (error) return <div>{error.message}</div>;
  if (!isLoading && !user) {
    router.push("/");
  }

  return (
    <Box>
      <Header />
      <Section>
        <Container>
          <Skeleton loading={isLoading}>
            <Flex direction="column" gap="4">
              <NextLink href="/">
                <Button color="ruby"><ArrowLeftIcon /> Back to dashboard</Button>
              </NextLink>
              <Card>
                <DataList.Root>
                  <DataList.Item>
                    <DataList.Label>Name</DataList.Label>
                    <DataList.Value>{user?.name}</DataList.Value>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.Label>Email</DataList.Label>
                    <DataList.Value>{user?.email}</DataList.Value>
                  </DataList.Item>
                </DataList.Root>
              </Card>
              <Card>
                <Flex direction="column" gap="4">
                  <TextField.Root placeholder="Enter prompt..." size="2" onChange={(e) => setPrompt(e.target.value)}>
                    <TextField.Slot>
                      <TextAlignLeftIcon />
                    </TextField.Slot>
                    <TextField.Slot>
                      <IconButton size="1" variant="ghost" onClick={infer}>
                        <PaperPlaneIcon />
                      </IconButton>
                    </TextField.Slot>
                  </TextField.Root>
                  <Section size="1">
                    <ScrollArea type="always" scrollbars="vertical" className="max-h-80 border-solid border-2 border-[#484848] rounded-md">
                      <Box p="4" pr="8">
                        <Text as="div" className="whitespace-pre-wrap">{response}</Text>
                      </Box>
                    </ScrollArea>
                  </Section>
                  <Flex justify="end">
                    <NextLink href="/">
                      <Button color="ruby"><Pencil2Icon /> Save Changes</Button>
                    </NextLink>
                  </Flex>
                </Flex>
              </Card>
            </Flex>
          </Skeleton>
        </Container>
      </Section>
    </Box>
  );
}
