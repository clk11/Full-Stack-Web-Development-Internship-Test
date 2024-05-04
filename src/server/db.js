import neo4j from 'neo4j-driver';
import 'dotenv/config.js'

const NEO_URL = process.env.NEO_URL;
const NEO_USER = process.env.NEO_USER;
const NEO_PASS = process.env.NEO_PASS;


const driver = neo4j.driver(NEO_URL, neo4j.auth.basic(NEO_USER, NEO_PASS));

async function query(text, params) {
    const session = driver.session();
    const result = (await session.run(text, params)).records.map(x => x._fields);
    await session.close();
    return result;
}
export default query;