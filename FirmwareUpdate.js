const getConnection = require('../Config/database.js');
//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
var Converter = require('./Converter')
var Command = require('./Command')
const { encode, decode } = require('single-byte');
module.exports = {
    main: async function (data, userID,version,FirmwareUpdatePort) {
        try {
            version=version.replace("v","")
            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {

                var settings = {};
                settings.userID = userID;
                settings.linkData = ""
                settings.linkType = ""
                settings.isDebugSend = false;
                settings.UniqueID = null;

                let Unit = {}
                let date = new Date(new Date().toUTCString());
                let unixTimeStamp = Math.floor(date.getTime() / 1000);
                Unit.ID = data[i].NextPacketID,
                Unit.Destination = data[i].unitUniqueId,
                Unit.Source = 1,
                Unit.date = unixTimeStamp;
                Unit.EventCode =  4116,
                Unit.EventData = getBytes(settings,version,FirmwareUpdatePort);
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
function getBytes(data,version,FirmwareUpdatePort) {
    let bytearray =new Buffer.allocUnsafe(0);;
    //logger.log("getBytes() function Started", "info");

    let Versions=version.split(".")
    let FirmwareVersion='';
    if(Versions.length==1){
        let int=parseInt(Versions[0]);
        int=int.toString(16).toUpperCase();
        if(int.length==1){
            int="0"+int
        }
        FirmwareVersion=int+"00"
    }else{
        let int1=parseInt(Versions[0])
        int1=int1.toString(16).toUpperCase()
        if(int1.length==1){
            int1="0"+int1
        }
        let int2=parseInt(Versions[1]);
        int2=int2.toString(16).toUpperCase()
        if(int2.length==1){
            int2="0"+int2
        }
        FirmwareVersion=int1+int2
    }
    let FirmwareVersionByte= Buffer.from(FirmwareVersion, 'hex');
    bytearray = Buffer.concat([bytearray, FirmwareVersionByte]);
   
    Port=FirmwareUpdatePort
    FirmwareUpdateUrl="dev.assetor.net"
    let PortByte=Converter.Short(Port)
    bytearray = Buffer.concat([bytearray, PortByte]);
    let urlByte = encode('windows-1252',FirmwareUpdateUrl );        
    bytearray = Buffer.concat([bytearray, urlByte]);
    let first = Converter.byte(13);
    bytearray = Buffer.concat([bytearray, first]);
    let second = Converter.byte(10);
    bytearray = Buffer.concat([bytearray, second]);
    //logger.log("getBytes() End", "info");
    return bytearray;
}