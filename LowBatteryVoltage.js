//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
var Converter = require('./Converter')
var Command = require('./Command')

module.exports = {
    main: async function (data, userID,PrevisousData) {
        try {

            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {

                var pendingDetails = {};
                
                if (PrevisousData != null && PrevisousData.LowVoltageThreshold == data[i].LowVoltageThreshold &&
                    PrevisousData.LowVoltageThresholdDuration == data[i].LowVoltageThresholdDuration){

                    continue;
                }
      
            
                if (data[i].LowVoltageThreshold == null) {
                    pendingDetails.LowVoltageThreshold = 0
                } else {
                    pendingDetails.LowVoltageThreshold = data[i].LowVoltageThreshold * 100
                }
                pendingDetails.Duration=data[i].LowVoltageThresholdDuration;
                pendingDetails.userID = userID;
                pendingDetails.linkData = ""
                pendingDetails.linkType = ""
                pendingDetails.isDebugSend = false;
                pendingDetails.UniqueID = null;

                let Unit = {}
                let date = new Date(new Date().toUTCString());
                let unixTimeStamp = Math.floor(date.getTime() / 1000);
                Unit.ID = data[i].NextPacketID,
                Unit.Destination = data[i].unitUniqueId,
                Unit.Source = 1,
                Unit.date = unixTimeStamp;
                Unit.EventCode =  4279,
                Unit.EventData = getBytes(pendingDetails);
                Unit.CustomEventCode = 0;
                Unit.Length = Unit.EventData.length
                Command.SendToUnit(Unit,pendingDetails);
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
    
    let bytelowBatteryVoltageThreshold = Converter.Short(data.LowVoltageThreshold);
    bytearray = Buffer.concat([bytearray, bytelowBatteryVoltageThreshold]);

    let byteDuration = Converter.byte(data.Duration);
    bytearray = Buffer.concat([bytearray, byteDuration]);


   //logger.log("getBytes() End", "info");
    return bytearray;
}