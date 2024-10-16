const fs = require('fs');
const csv = require('csv-parser');
// const pLimit = require('p-limit');

async function processCSV(file) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(csv())
      .on('data', async (row) => {
        // Process data and write to the database (await the write operation)
        try {
          await writeToDatabase(row); 
        } catch (error) {
          console.error(`Error writing to database: ${error}`);
          // Handle the error appropriately (e.g., retry, skip, etc.)
        }
      })
      .on('end', () => {
        console.log(`Done with ${file}`);
        resolve();
      })
      .on('error', reject);
  });
}

async function processCSVs(files) {
  const limit = pLimit(5); // Limit to 5 concurrent files (adjust as needed)

  const promises = files.map(file => limit(() => processCSV(file)));
  await Promise.all(promises); 
}