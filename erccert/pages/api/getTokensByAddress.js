import conn from '../../lib/db'

export default async (req, res) => {
  try {
    const query = 'select * from certifications where address=$1'
    const values = [req.body.address]
    console.log('request: '+req.body.address)
    const result = await conn.query(
        query,
        values
    );

    res.status(200).json({ result })

    // return new Promise((resolve, reject) => {
    //   res
    //       .then(response => {
    //         res.statusCode = 200
    //         res.setHeader('Content-Type', 'application/json');
    //         res.setHeader('Cache-Control', 'max-age=180000');
    //         res.end(JSON.stringify(response));
    //         resolve();
    //       })
    //       .catch(error => {
    //         res.json(error);
    //         res.status(405).end();
    //         resolve(); // in case something goes wrong in the catch block (as vijay commented)
    //       });
    // });
  } catch ( error ) {
    console.log( error );
  }


};