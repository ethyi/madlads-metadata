import * as fs from "fs";
import { promisify } from "util";

const readFile = promisify(fs.readFile);

async function readJsonFile(filename: string): Promise<any> {
    try {
        const fileContent = await readFile(filename, "utf-8");
        const jsonData = JSON.parse(fileContent);
        return jsonData;
    } catch (error) {
        console.error(`Error reading JSON file: ${error.message}`);
        return null;
    }
}

async function main() {
    const filename = "metadata.json";
    const jsonData: any[] = await readJsonFile(filename);
    const ownerMap = new Map();
    jsonData.forEach((item, index) => {
        const owner = item.firstOwner;
        if (!ownerMap.has(owner)) {
            ownerMap.set(owner, []);
        }
        const owned = ownerMap.get(owner);
        owned.push(item);
    });

    const keyValuePairs: any = [];
    for (const entry of ownerMap) {
        keyValuePairs.push(entry);
    }
    keyValuePairs.sort((a, b) => b[1].length - a[1].length);
    const top10Pairs = keyValuePairs.slice(0, 50);
    const top10Keys = top10Pairs.map((pair) => [pair[0], pair[1].length]);

    console.log(top10Keys);
}
main();
