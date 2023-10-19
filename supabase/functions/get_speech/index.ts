// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { OpenAI } from "https://deno.land/x/openai/mod.ts";
import { SanityClient } from "https://cdn.skypack.dev/@sanity/client";

// const openai = new OpenAI({
//   apiKey: "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",
// });

const openai = new OpenAI(
  "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"
);

console.log("Hello from Functions!");

const content = (animal: string) =>
  `say something unique but true about the following word name or phrase: "${animal}"`;

// TODO:incorprate highest number
// const content = (animal) =>  ` reply the following question with the highest number only, "which number is higher  ${animal}", i.e if the numbers are 70 and 80 say  " 80" `

async function talk(animal: string) {
  const chatCompletion = await openai.createChatCompletion({
    messages: [{ role: "user", content: content(animal) }],
    model: "gpt-3.5-turbo",
  });

  return chatCompletion;
}

Deno.serve(async (req) => {
  const { name } = await req.json();
  const response = await talk(name).then((res) => res.choices[0].message);
  const data = {
    message: response,
  };

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
