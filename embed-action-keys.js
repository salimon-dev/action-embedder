import fs from "fs";
import chalk from "chalk";
import { embed } from "./embedding.js";

const input = "./actions.json";
const output = "./output/actions.jsonl";

async function embedSingleActionKey(actionKey) {
  console.log(`${chalk.blue("embedding")}\t\t${actionKey.type}`);
  const data = JSON.stringify(actionKey);
  const vector = await embed(data);
  console.log(`${chalk.blue("embedded")}\t\t${actionKey.type}`);
  const result = { ...actionKey, vector };
  fs.appendFileSync(output, `${JSON.stringify(result)}\n`);
}
async function main() {
  console.log(chalk.yellow(`embedding action keys from ${input}...`));
  const actionKeys = JSON.parse(fs.readFileSync("./actions.json"));
  for (const actionKey of actionKeys) {
    await embedSingleActionKey(actionKey);
  }
  console.log(chalk.green("action keys embedded successfully"));
  console.log(`output: ${output}`);
}

main();
