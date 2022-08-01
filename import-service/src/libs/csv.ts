import { Readable } from "stream";
import csv from "csv-parser";

export const parseCSV = async (stream: Readable) => {
  return await new Promise((resolve, reject) => {
    const data = [];
    stream
      .pipe(csv())
      .on("error", reject)
      .on("data", (record) => {
        console.log(`csv record: ${record}`);
        data.push(record);
      })
      .on("end", () => {
        resolve(data);
      });
  });
};
