import conn from '../../lib/db'

export default async (req, res) => {
    try {
        const query = 'INSERT INTO certifications(address,ipfs,created_on) VALUES($1,$2,$3)'
        const values = [req.body.address,req.body.mintUri,new Date().toLocaleString()]
        const result = await conn.query(
            query,
            values
        );
    } catch ( error ) {
        console.log( error );
    }


};