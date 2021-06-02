//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
var Command = require('./Command')
var Converter = require('./Converter')

module.exports = {
    main: async function (data, userID) {
        try {
            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {

                var settings = {};
                if(data[i].System == 6 || data[i].System == 7 ){
                    settings.Type = data[i].AssetTypeCommunicationType
                    settings.Alert= data[i].tsHours != null && data[i].tsHours>data[i].AssetTypeComThreshold ? 1: 0
                    settings.Threshold = data[i].AssetTypeComThreshold
                }else{
                    settings.Type = data[i].AssetTypeCommunicationType
                    settings.Alert= data[i].tsHours != null && data[i].tsHours>data[i].AssetTypeComThreshold ? 1: 0
                    settings.Threshold = data[i].AssetTypeComThreshold
                }

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
                Unit.EventCode =  4112,
                Unit.EventData = getBytes(settings);
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
    
    let TypeByte=Converter.byte(data.Type);
    let AlertByte=Converter.byte(data.Alert);

    let nums= (AlertByte[0] << 4) + TypeByte[0]
    let dataIdlingbytes = Converter.byte(nums);
    bytearray = Buffer.concat([bytearray, dataIdlingbytes]);

    let ThreasHoldbytes = Converter.byte(data.Threshold);
    bytearray = Buffer.concat([bytearray, ThreasHoldbytes]);

    //logger.log("getBytes() End", "info");
    return bytearray;
}