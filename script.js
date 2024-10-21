// Import Neo4j driver
const neo4j = require('neo4j-driver');

// Connect to the Neo4j instance
const driver = neo4j.driver(
    'bolt://localhost:7687',  // Replace with your Neo4j Bolt URL
    neo4j.auth.basic('neo4j', '01092532349') // Replace with your username and password
);

async function connectAndQuery() {
    const session = driver.session();
    try {
        const result = await session.run(
            'MATCH (n) RETURN n LIMIT 25'
        );
        
        // Print the nodes
        result.records.forEach(record => {
            console.log(record.get('n'));
        });
    } catch (error) {
        console.error('Error querying Neo4j:', error);
    } finally {
        await session.close();
    }
}

// Run the function
connectAndQuery()
    .then(() => console.log('Query complete'))
    .catch(console.error)
    .finally(() => driver.close());
