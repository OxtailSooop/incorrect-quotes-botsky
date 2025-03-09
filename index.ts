import AtpAgent from '@atproto/api';
import { CronJob } from 'cron';
import { Ollama } from 'ollama';
import * as process from 'process';

// Create a Bluesky Agent 
const agent = new AtpAgent({
  service: 'https://bsky.social/',
})

let ollama = new Ollama({ host: "ollama" });

async function main() {
  await agent.login({ identifier: process.env.BLUESKY_USERNAME!, password: process.env.BLUESKY_PASSWORD! })

  await ollama.pull({ model: "llama3.2:1b" })

  let response = (await ollama.generate({ model: "llama3.2:1b", stream: false, prompt: "Give me an incorrect humourous quote and credit it to a random celebrity and nothing else." })).response;

  await agent.post({
    text: response,
  });

  console.log(response)
}

main();

// Run this on a cron job
const scheduleExpression = '@hourly';

const job = new CronJob(scheduleExpression, main);

job.start();