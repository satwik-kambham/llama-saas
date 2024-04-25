"use client";

import { useState } from "react";
import { Box, Container, Text, IconButton, ScrollArea, Section, TextField } from "@radix-ui/themes";
import Header from "../components/header";
import { PaperPlaneIcon, TextAlignLeftIcon } from "@radix-ui/react-icons";

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

export default function Home() {
  const [response, setResponse] = useState("");
  const [prompt, setPrompt] = useState("");

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

  return (
    <Box>
      <Header />
      <Section>
        <Container>
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
          <Section>
            <ScrollArea type="always" scrollbars="vertical" className="max-h-80 border-solid border-2 border-[#484848] rounded-md">
              <Box p="4" pr="8">
                <Text as="div" className="whitespace-pre-wrap">{response}</Text>
              </Box>
            </ScrollArea>
          </Section>
        </Container>
      </Section>
    </Box>
  );
}
