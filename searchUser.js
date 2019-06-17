const { clientInfo } = require('./config/db');
const { Client } = require('pg');


module.exports = function(email) {
    return new Promise((resolve, reject) => {

        const client = new Client(clientInfo);

        client.connect();

        const q = `SELECT u.email, u.id_idemia FROM public."usuario" u
            WHERE u.email = $1
            AND u.id_idemia is not null`;

        client.query(q, [email], (err, result) => {
            client.end();
            if (err) {
                console.error("err:", err);
                reject(err);
            } else {
                if (result.rows.length > 0) {
                    resolve({
                        status: true,
                        email: result.rows[0].email,
                        id_idemia: result.rows[0].id_idemia,
                    });
                } else {
                    resolve({
                        status: false
                    });
                }
            }
        });
    });
};