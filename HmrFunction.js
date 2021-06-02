//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
var Command = require('./Command')
var Converter = require('./Converter')
module.exports = {
    main: async function (data, userID) {
        try {
            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {

                if (!(data[i].System == 4)) {
                    continue;
                }
                var settings = {};
                settings.Function = data[i].BatteryHMREnabled == "Y" ? 1 : 0;
                settings.ClassificationType = data[i].BatteryEquipmentClassification==null?0:data[i].BatteryEquipmentClassification;
                settings.userID = userID;
                settings.linkData = ""
                settings.linkType = ""
                settings.isDebugSend = false;
                settings.UniqueID = null;

                let Unit = {}
                let date = new Date(new Date().toUTCString());
                let unixTimeStamp = Math.floor(date.getTime() / 1000);
                Unit.ID = data[i].NextPacketID
                Unit.Destination = data[i].unitUniqueId
                Unit.Source = 1
                Unit.date = unixTimeStamp;
                Unit.EventCode = 4135
                Unit.EventData = getBytes(settings);
                Unit.CustomEventCode = 0;
                Unit.Length = Unit.EventData.length
                Command.SendToUnit(Unit, settings);
            }
            //logger.log("End", "info");
        } catch (err) {
            //logger.log("main() \n" + err, "error");
        }

    }
};
function getBytes(data) {
    let bytearray = new Buffer.allocUnsafe(0);;
    //logger.log("getBytes() function Started", "info");

    let bytesFunction = Converter.byte(data.Function+data.ClassificationType);
    bytearray = Buffer.concat([bytearray, bytesFunction]);

//    let bytesClassificationType = Converter.byte(data.ClassificationType);
  //  bytearray = Buffer.concat([bytearray, bytesClassificationType]);

    //logger.log("getBytes() End", "info");
    return bytearray;
}