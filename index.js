const express = require('express');
const multer = require('multer');
const upload = multer();
const authenticatePerson = require('./authenticatePerson');
const codificarImagen = require('./codificarImagen');
const searchUser = require('./searchUser');
const getInfoUser = require('./getInfoUser');

var app = express();

app.post('/validaIdentidad', upload.single('photo'), function(req, res) {
    const photo = req.file;
    const emal = req.body.email;

    searchUser(emal).then(resultSQL => {
        if (resultSQL.status) {
            const imgb64 = photo.buffer.toString('base64');
            let identificador = resultSQL.email.replace('@', '').replace(/\./g, '') + (new Date()).getTime();

            codificarImagen(imgb64, identificador).then(resultXML => {
                authenticatePerson(resultXML.person, resultSQL.id_idemia).then(resAuth => {
                    console.log(resAuth);
                    if (resAuth.errCode != 'SUCCESS') {
                        enviarError(resAuth.errCode, res);
                    } else {
                        if (resAuth.hit) {
                            getInfoUser(emal).then(resultSQLInfo => {
                                console.log(resultSQLInfo);
                                res.status(200).json({
                                    status: resAuth.hit,
                                    info: resultSQLInfo
                                });
                            }).catch(err => enviarError(err, res));
                        } else {
                            // console.log('object');
                            res.status(200).json({
                                status: resAuth.hit,
                                info: null
                            });
                        }
                    }
                }).catch(err => {
                    enviarError(err, res);
                });
            }).catch(err => enviarError(err, res));
        } else {
            res.status(200).json({
                status: false,
                msg: 'Usuario no enrolado'
            });
        }
    }).catch(err => {
        res.status(500).json({
            status: false,
            msg: err
        });
    });
});


function enviarError(e, res) {
    res.status(500).json({
        result: false,
        error: e
    });
}

app.listen(process.env.PORT || 3002, () => {
    console.log('Escuchando puerto: ', process.env.PORT || 3002);
});