const fs = require('fs');
const csv = require('csv-parser');

async function processCSVs(files, batchSize = 1000) {
    for (const file of files) { 
        await new Promise((resolve, reject) => {
            let batch = [];
            fs.createReadStream(file)
                .pipe(csv())
                .on('data', async (row) => {
                    batch.push(row);
                    if (batch.length >= batchSize) {
                        try {
                            await writeToDatabase(batch);
                            batch = [];
                        } catch (error) {
                            console.error("Error writing to database:", error);
                            reject(error);
                        }
                    }
                })
                .on('end', async () => {
                    if (batch.length > 0) {
                        try {
                            await writeToDatabase(batch);
                        } catch (error) {
                            console.error("Error writing to database:", error);
                            reject(error);
                        }
                    }
                    console.log(`Done with ${file}`);
                    resolve();
                })
                .on('error', reject); 
        });
    }
}

async function writeToDatabase(rows) {
    // Your database write logic for batch inserts
    // ...
}