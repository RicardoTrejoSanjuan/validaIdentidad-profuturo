const request = require('request');
const libxmljs = require("libxmljs");
var urlServiceBiometric = 'http://200.66.76.220:8092/service/mbss?wsdl';

module.exports = function(personxml, id) {
    let peticion = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsdl="http://www.morpho.com/mbss/generic/wsdl">
        <soapenv:Header/>
        <soapenv:Body>
            <wsdl:process>
                <request>
                    <requestType>AUTHENTICATE_PERSON</requestType>
                    <authenticatePersonRequest>
                        <basicRequest>
                            <id>1</id>
                        </basicRequest>
                        ${personxml}
                        <referenceId>${id}</referenceId>
                    </authenticatePersonRequest>
                </request>
            </wsdl:process>
        </soapenv:Body>
    </soapenv:Envelope>
   `;

    return new Promise((resolve, reject) => {
        request({
            uri: urlServiceBiometric,
            method: 'POST',
            body: peticion,
            headers: {
                'Content-Type': 'text/xml'
            }
        }, (err, response, body) => {

            if (err) {
                console.error("err:", err);
                reject(err);
            } else {
                // console.log("body:", body);
                var xmlDoc = libxmljs.parseXml(body);

                var errCode = xmlDoc.get('//error/code').text();
                var candidate = xmlDoc.find('//decision');
                // var groups = xmlDoc.find('//groups/score');

                let hit = false;
                // let score = 0;

                candidate.forEach((c) => {
                    // console.log("c.text():", c.text());
                    if (c.text() != 'NO_HIT') {
                        hit = true;
                    }
                });

                // groups.forEach((s) => {
                //     score = s.text();
                // });

                resolve({
                    errCode,
                    hit
                });
            }
        });
    });
};