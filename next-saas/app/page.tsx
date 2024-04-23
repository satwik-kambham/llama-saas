"use client";

import { useState } from "react";

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
    <div>
      <h1>AI SAAS Application</h1>
      <input type="text" onChange={(e) => setPrompt(e.target.value)} />
      <p>{response}</p>
      <button onClick={infer}>Generate</button>
    </div>
  );
}
