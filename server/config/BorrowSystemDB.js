const mariadb = require ('mariadb');
const configDB = require ('../config.json');
const connection = mariadb.createPool ({
  host: configDB.MARIADB,
  user: configDB.DBUSER,
  password: configDB.DBPASSWORD,
  connectionLimit: 5,
  database: 'Borrow',
});
async function asyncFunction () {
  let conn;
  try {
    conn = await connection.getConnection ();
    const rows = await conn.query ('SELECT 1 as val');
    console.log ('Database Connected!!' + rows); //[ {val: 1}, meta: ... ]
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.end ();
  }
}
asyncFunction ();

module.exports = connection;
