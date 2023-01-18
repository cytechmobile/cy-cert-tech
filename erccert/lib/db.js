

import { Pool } from "pg";

let conn;

if (!conn) {
    conn = new Pool({
        user: 'cycert',
        password: 'cycert',
        host: '127.0.0.1',
        port: '5432',
        database: 'cycert',
    });
}

export default conn ;