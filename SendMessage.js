//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
var Command = require('./Command')
const { encode, decode } = require('single-byte');
var Converter = require('./Converter')
module.exports = {
    main: async function (data, userID,UserName,Question,Answer1,Answer2) {
        try {
            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {

                var settings = {};
                settings.userID = userID;
                settings.linkData = (""+data[i].MessageID).toLowerCase()
                settings.linkType = "M"
                settings.isDebugSend = false;
                
                settings.Body = Question
                settings.UniqueID = data[i].MessageUniqueID
                settings.WebUser = UserName
                settings.Answer1 = Answer1
                settings.Answer2 = Answer2

                let Unit = {}
                let date = new Date(new Date().toUTCString());
                let unixTimeStamp = Math.floor(date.getTime() / 1000);
                Unit.ID = data[i].NextPacketID,
                Unit.Destination = data[i].unitUniqueId,
                Unit.Source = 1,
                Unit.date = unixTimeStamp;
                Unit.EventCode =  4278,
                Unit.EventData = getBytes(settings);
                settings.UniqueID = null;
                Unit.CustomEventCode = 0;
                Unit.Length = Unit.EventData.length
                Command.SendToUnit(Unit,settings);
            }
            //logger.log("End", "info");
        } catch (err) {
            //logger.log("main() \n" + err, "error");
        }

    }
};
function getBytes(data) {
    let bytearray =new Buffer.allocUnsafe(0);;
    //logger.log("getBytes() function Started", "info");
    let first = Converter.byte(13);
    let second = Converter.byte(10);

    let uniqueByte = Converter.Short(data.UniqueID);
    bytearray = Buffer.concat([bytearray, uniqueByte]);

    let bodyByte = encode('windows-1252',data.Body);        
    bytearray = Buffer.concat([bytearray, bodyByte]);
    bytearray = Buffer.concat([bytearray, first]);
    bytearray = Buffer.concat([bytearray, second]);

    let Answer1Byte = encode('windows-1252',data.Answer1);        
    bytearray = Buffer.concat([bytearray, Answer1Byte]);
    bytearray = Buffer.concat([bytearray, first]);
    bytearray = Buffer.concat([bytearray, second]);

    let Answer2Byte = encode('windows-1252',data.Answer2);        
    bytearray = Buffer.concat([bytearray, Answer2Byte]);
    bytearray = Buffer.concat([bytearray, first]);
    bytearray = Buffer.concat([bytearray, second]);

    let WebUserByte = encode('windows-1252',data.WebUser);        
    bytearray = Buffer.concat([bytearray, WebUserByte]);
    bytearray = Buffer.concat([bytearray, first]);
    bytearray = Buffer.concat([bytearray, second]);

    //logger.log("getBytes() End", "info");
    return bytearray;
}