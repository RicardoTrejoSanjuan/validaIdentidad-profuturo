const { clientInfo } = require('./config/db');
const { Client } = require('pg');


module.exports = function(email) {
    return new Promise((resolve, reject) => {

        const client = new Client(clientInfo);

        client.connect();

        const q = `SELECT i.email, i.cve_elector, i.nombre, i.ap_paterno,
        i.ap_materno, i.cic, i.ocr, i.anio_expedicion, i.anio_vencimiento
        FROM public."ine" i
        WHERE i.email = $1`;

        client.query(q, [email], (err, result) => {
            client.end();
            if (err) {
                console.error("err:", err);
                reject(err);
            } else {
                if (result.rows.length > 0) {
                    resolve({
                        email: result.rows[0].email,
                        cve_elector: result.rows[0].cve_elector,
                        nombre: result.rows[0].nombre,
                        ap_paterno: result.rows[0].ap_paterno,
                        ap_materno: result.rows[0].ap_materno,
                        cic: result.rows[0].cic,
                        ocr: result.rows[0].ocr,
                        anio_expedicion: result.rows[0].anio_expedicion,
                        anio_vencimiento: result.rows[0].anio_vencimiento
                    });
                } else {
                    resolve(null);
                }
            }
        });
    });
};