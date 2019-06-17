const request = require('request');
const libxmljs = require("libxmljs");
var urlServiceBiometric = 'http://200.66.76.220:8092/service/mbss?wsdl';

module.exports = function(imgb64, id) {
    let peticion = `
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsdl="http://www.morpho.com/mbss/generic/wsdl">
            <soapenv:Header/>
            <soapenv:Body>
            <wsdl:process>
                    <request>
                        <requestType>ENCODE_PERSON</requestType>
                        <encodePersonRequest>
                            <basicRequest>
                            <id>2</id>
                            </basicRequest>
                            <person>
                                <id>${id}</id>
                                <registration>
                                <id>133</id>
                                <faceSample>
                                        <id>55566</id>
                                        <sampleType>STILL</sampleType>
                                        <stillImage>
                                            <image>
                                            <format>JPEG</format>
                                            <buffer>${imgb64}</buffer>
                                            </image>
                                        </stillImage>
                                    </faceSample>
                                </registration>
                            </person>
                        </encodePersonRequest>
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
                var xmlDoc = libxmljs.parseXml(body);

                var errCode = xmlDoc.get('//error/code').text();
                if (errCode != 'SUCCESS') {
                    reject(errCode);
                } else {
                    var person = xmlDoc.get('//encodePersonResponse/person').toString();
                    // if (num == 0) {
                    //     person = person.replace('<person>', '<personSearch>');
                    //     person = person.replace('</person>', '</personSearch>');
                    // } else {
                    //     person = person.replace('<person>', '<personRef>');
                    //     person = person.replace('</person>', '</personRef>');
                    // }
                    resolve({
                        errCode,
                        person
                    });
                }
            }
        });
    });
};