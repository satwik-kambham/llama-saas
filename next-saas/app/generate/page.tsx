"use client";

import { useState } from "react";
import NextLink from "next/link";
import { Box, Container, Text, IconButton, ScrollArea, Section, TextField, Card, Button, Flex, Skeleton, DataList, RadioCards, CheckboxCards } from "@radix-ui/themes";
import Header from "../components/Header";
import { ArrowLeftIcon, PaperPlaneIcon, Pencil2Icon, TextAlignLeftIcon } from "@radix-ui/react-icons";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import paths from "../../state";

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

function generatePrompt(topic: string, levelId: string, methodIds: string[]) {
  let level = "";
  let methods = "";
  
  if (levelId === "1") level = "Beginner";
  else if (levelId === "2") level = "Intermediate";
  else if (levelId === "3") level = "Advanced";
  else level = "Beginner";

  if (methodIds.includes("1")) methods += "Project Based, ";
  if (methodIds.includes("2")) methods += "Courses, ";
  if (methodIds.includes("3")) methods += "Books, ";
  if (methodIds.includes("4")) methods += "Websites, ";

  let prompt = "Create a learning path for " + level + " level students on " + topic + " using " + methods + "as the primary learning resources. The learning path should be comprehensive and cover all the necessary topics and concepts.";

  if (methods.length > 0) {
    prompt = "Create a learning path for " + level + " level students on " + topic + ". The learning path should be comprehensive and cover all the necessary topics and concepts.";
  }
  return prompt;
}

function saveResponse(topic: string, level: string, methods: string[], response: string) {
  // await prisma.paths.create({
  //   data: {
  //     topic: topic,
  //     level: level,
  //     methods: methods.join(","),
  //     path: response,
  //   }
  // });
  console.log(paths)
  paths.push({
    topic: topic,
    level: level,
    methods: methods.join(","),
    path: response,
  });
  console.log(paths)
}

export default function Generate() {
  const { user, error, isLoading } = useUser();
  const [response, setResponse] = useState("");
  const [level, setLevel] = useState("1");
  const [methods, setMethods] = useState([]);
  const [topic, setTopic] = useState("");
  const router = useRouter();

  async function infer() {
    setResponse("");
    const prompt = generatePrompt(topic, level, methods);
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

  function save() {
    saveResponse(topic, level, methods, response);
    router.push("/");
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
                  <TextField.Root placeholder="Enter topic..." size="2" onChange={(e) => setTopic(e.target.value)}>
                    <TextField.Slot>
                      <TextAlignLeftIcon />
                    </TextField.Slot>
                    <TextField.Slot>
                      <IconButton size="1" variant="ghost" onClick={infer}>
                        <PaperPlaneIcon />
                      </IconButton>
                    </TextField.Slot>
                  </TextField.Root>
                  <Box>
                    <RadioCards.Root onValueChange={(v) => setLevel(v)} defaultValue="1" columns={{ initial: '1', sm: '3' }} size="1" color="ruby">
                      <RadioCards.Item value="1">
                        <Text weight="bold">Beginner</Text>
                      </RadioCards.Item>
                      <RadioCards.Item value="2">
                        <Text weight="bold">Intermediate</Text>
                      </RadioCards.Item>
                      <RadioCards.Item value="3">
                        <Text weight="bold">Advanced</Text>
                      </RadioCards.Item>
                    </RadioCards.Root>
                  </Box>
                  <Box>
                    <CheckboxCards.Root onValueChange={(v) => setMethods(v)} defaultValue={['1']} columns={{ initial: '1', sm: '4' }} color="ruby">
                      <CheckboxCards.Item value="1">
                        <Text weight="bold">Project Basesd</Text>
                      </CheckboxCards.Item>
                      <CheckboxCards.Item value="2">
                        <Text weight="bold">Courses</Text>
                      </CheckboxCards.Item>
                      <CheckboxCards.Item value="3">
                        <Text weight="bold">Books</Text>
                      </CheckboxCards.Item>
                      <CheckboxCards.Item value="4">
                        <Text weight="bold">Websites</Text>
                      </CheckboxCards.Item>
                    </CheckboxCards.Root>
                  </Box>
                  <Section size="1">
                    <ScrollArea type="always" scrollbars="vertical" className="max-h-80 border-solid border-2 border-[#484848] rounded-md">
                      <Box p="4" pr="8">
                        <Text as="div" className="whitespace-pre-wrap">{response}</Text>
                      </Box>
                    </ScrollArea>
                  </Section>
                  <Flex justify="end">
                    <Button onClick={save} color="ruby"><Pencil2Icon /> Save Changes</Button>
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
