import conn from '../../lib/db'

export default async (req, res) => {
  try {
    const query = 'select * from certifications where address=$1'
    const values = [req.body.address]
    const result = await conn.query(
        query,
        values
    );
    res.status(200).json({ result })

  } catch ( error ) {
    console.log( error );
  }


};