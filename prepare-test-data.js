import { embed } from "./embedding.js";
import fs from "fs";
import chalk from "chalk";

const output = "./output/test.jsonl";

/**
 * loads test data from test directory with/without vectors
 * @param {*} loadVectors
 */
export function loadTestData(loadVectors) {
  function readTestAKData(name) {
    const fileNames = fs.readdirSync("./test/" + name);
    return fileNames.map((fileName) => {
      const data = fs.readFileSync(`./test/${name}/${fileName}`).toString();
      const id = fileName.replace(".json", "");
      return { name, id, data: JSON.parse(data) };
    });
  }
  const names = fs.readdirSync("./test");
  const records = [];
  names.forEach((name) => {
    const data = readTestAKData(name);
    records.push(...data);
  });
  return records;
}

async function embedData(record) {
  console.log(`${chalk.blue("reading")}\t\t${record.id}\t${record.name}`);
  const vectors = await embed(JSON.stringify(record.data));
  fs.appendFileSync(output, JSON.stringify({ ...record, vectors }) + "\n");
  console.log(`${chalk.blue("ready")}\t\t${record.id}\t${record.name}`);
}

async function main() {
  console.log(chalk.yellow("embedding test data..."));
  const data = loadTestData(false);
  fs.rmSync(output, { force: true });
  for (const record of data) {
    await embedData(record);
  }
  console.log(chalk.green("embedding test data completed successfully."));
  console.log("output:", output);
}

main();
