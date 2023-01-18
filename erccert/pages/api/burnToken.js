import conn from '../../lib/db'

export default async (req, res) => {
    try {
        const query = 'DELETE FROM certifications where token_id = $1'
        const values = [req.body.tokenId]
        const result = await conn.query(
            query,
            values
        );
        res.status(200).json({ result })
    } catch ( error ) {
        console.log( error );
    }


};