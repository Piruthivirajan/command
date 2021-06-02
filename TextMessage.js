const getConnection = require('../Config/database.js');
//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
const sql = require('mssql')
var Converter = require('./Converter')
var Command = require('./Command')
module.exports = {
    main: async function (data, userID) {
        try {

            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {
                var textmessage = {};
                var gpstype ={};
                let num = 0;
                let num1 = 0;
                if (data[i].GPS == null ||data[i].GPS == false || data[i].GPS == 0) {
                    textmessage.GPS = 0
                    gpstype=null
                    textmessage.GPSType = nul1
                    textmessage.Longitude = 0
                    textmessage.Latitude = 0
                    textmessage.Speed = 0
                    textmessage.Direction = 0
                } else {
                    gpstype= data[i].GPSType
                    textmessage.GPS = 1
                    textmessage.GPSType = data[i].GPSType
                    if (data[i].Longitude == null) {
                        textmessage.Longitude = 0
                    } else {
                        textmessage.Longitude = data[i].Longitude
                    }
                    if (data[i].Latitude == null) {
                        textmessage.Latitude = 0
                    } else {
                        textmessage.Latitude = data[i].Latitude
                    }
                    if (data[i].Speed == null) {
                        textmessage.Speed = 0
                    } else {
                        textmessage.Speed = data[i].Speed
                    }
                    if (data[i].Direction == null) {
                        textmessage.Direction = 0
                    } else {
                        textmessage.Direction = data[i].Direction
                    }
                }
                if (data[i].Operator == null) {
                    textmessage.Operator = 0
                } else {
                    textmessage.Operator = data[i].Operator
                }
                if (data[i].MessageNo == null) {
                    textmessage.MessageNo = 0
                } else {
                    textmessage.MessageNo = data[i].MessageNo
                }
                if (data[i].MessageBody == null) {
                    textmessage.MessageBody = 0
                } else {
                    textmessage.MessageBody = data[i].MessageBody
                }
               
                textmessage.userID = userID;
                textmessage.linkData = ""
                textmessage.linkType = ""
                textmessage.isDebugSend = false;
                textmessage.UniqueID = null;

                let Unit = {}
                let date = new Date(new Date().toUTCString());
                let unixTimeStamp = Math.floor(date.getTime() / 1000);
                Unit.ID = data[i].NextPacketID,
                Unit.Destination = data[i].unitUniqueId,
                Unit.Source = 1,
                Unit.date = unixTimeStamp;
                Unit.EventCode =  4278,
                Unit.EventData = getBytes(textmessage);
                Unit.CustomEventCode = 0;
                Unit.Length = Unit.EventData.length
                Command.SendToUnit(Unit,sensor);
            }
            //logger.log("End", "info");
        } catch (err) {
            //logger.log("main() \n" + err, "error");
        }

    }
};
function getBytes(data) {
    let bytearray =new Buffer.allocUnsafe(0);;
    //logger.log("Senor.getBytes() function Started", "info");

    if(data.GPS==1)
    {
        let bytesLongitude = Converter.float(data.Longitude);
        bytearray = Buffer.concat([bytearray, byteslongitude]);

        let bytesLatitude = Converter.float(data.Latitude);
        bytearray = Buffer.concat([bytearray, bytesLatitude]);

        let bytesSpeed = Converter.Short(data.Speed);
        bytearray = Buffer.concat([bytearray, bytesSpeed]);

        let bytesDirection = Converter.Short(data.Direction);
        bytearray = Buffer.concat([bytearray, bytesDirection]);
    }
    let bytesOperator = Converter.Short(data.Operator);
    bytearray = Buffer.concat([bytearray, bytesOperator]);

    let bytesMessageNo = Converter.Short(data.MessageNo);
    bytearray = Buffer.concat([bytearray, bytesMessageNo]);

    //Message body has to be checked
    //nums.AddRange(
				// from c in (IEnumerable<char>)this.MessageBody.ToCharArray()
				// select (byte)c);
    let bytesMessageBody = Converter.Float(data.MessageBody);
    bytearray = Buffer.concat([bytearray, bytesMessageBody]);

    bytearray = Buffer.concat([bytearray, 13]);
    
    //logger.log("Sensor.getBytes() End", "info");
    return bytearray;
}