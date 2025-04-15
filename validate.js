import { embed } from "./embedding.js";
import fs from "fs";
import chalk from "chalk";

const vectorsPath = "./output/test.jsonl";
const actionKeysPath = "./output/actions.jsonl";

const threshold = 1.2;

function calcDistance(vector1, vector2, len) {
  let sum = 0;
  for (let i = 0; i < len; i++) {
    const diff = vector1[i] - vector2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}
async function findBestAction(actions, vectors) {
  let min = Number.MAX_VALUE;
  let actionKey = null;
  for (const action of actions) {
    const diff = calcDistance(vectors, action.vector, vectors.length);
    if (diff < min) {
      min = diff;
      actionKey = actions.type;
    }
  }
  return { diff: min, actionKey };
}

export async function validate(actions, testData) {
  const { diff, actionKey } = await findBestAction(actions, testData.vectors);
  if (diff > threshold) return;
  return { diff, correct: testData.actionKey === actionKey };
}

function loadActions() {
  const content = fs
    .readFileSync(actionKeysPath)
    .toString()
    .split("\n")
    .filter((item) => !!item);
  return content.map((item) => JSON.parse(item));
}
function loadTests() {
  return fs
    .readFileSync(vectorsPath)
    .toString()
    .split("\n")
    .filter((item) => !!item)
    .map((line) => JSON.parse(line));
}

async function main() {
  console.log(chalk.yellow("validating embeds..."));
  const actions = loadActions();
  const tests = loadTests();
  for (const test of tests) {
    const result = await validate(actions, test);
    if (!result) {
      if (test.name === "none") {
        console.log(chalk.green(`validated\t${test.id}\t${0.0}\t${test.name}`));
      } else {
        console.log(chalk.red(`failure  \t${test.id}\t${0.0}\t${test.name}`));
      }
    } else {
      console.log(chalk.green(`validated\t${test.id}\t${result.diff}\t${test.name}`));
    }
  }
  console.log(chalk.yellow("validation complete"));
}

main();
