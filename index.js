import fs from "fs";
import dotenv from "dotenv";
import { validate } from "./validate.js";
import { embedAction } from "./embedding.js";
dotenv.config();

function readActions() {
  const content = fs.readFileSync("./raw-actions.json", "utf8");
  return JSON.parse(content);
}

function readTestData() {
  const content = fs.readFileSync("./test-data.json", "utf8");
  return JSON.parse(content).map((item) => ({ ...item, input: JSON.stringify(item.input) }));
}

async function main() {
  // console.log("reading actions");
  // const actions = readActions();
  // for (const action of actions) {
  //   console.log(`embedding \x1b[34m${action.type}\x1b[0m`);
  //   const vector = await embedAction(action);
  //   action.vector = vector;
  // }
  // console.log("reading test data");
  // const testData = readTestData();
  // for (let i = 0; i < testData.length; i++) {
  //   const item = testData[i];
  //   console.log(`\n\x1b[35membedding input:\x1b[0m index ${i}`);
  //   const result = await validate(actions, item);
  //   if (!result) {
  //     console.error(`failed in test case number ${i + 1}`);
  //     return;
  //   }
  //   console.log(`diff: ${result.diff}`);
  // }
}

main();
