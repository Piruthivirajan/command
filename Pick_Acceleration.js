//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
var Converter = require('./Converter')
var Command = require('./Command')

module.exports = {
    main: async function (data, userID,PrevisousData) {
        try {

            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {
                if (data[i].System != 4 && data[i].Classification!=6) {
                    continue
                }
                if (PrevisousData != null && PrevisousData.Battery_PickAcceleration_ThresholdX == data[i].Battery_PickAcceleration_ThresholdX &&
                    PrevisousData.Battery_PickAcceleration_ThresholdY == data[i].Battery_PickAcceleration_ThresholdY &&
                    PrevisousData.Battery_PickAcceleration_ThresholdZ == data[i].Battery_PickAcceleration_ThresholdZ) {
                    continue;
                }

                var settings = {};
                                
                if (data[i].Battery_PickAcceleration_ThresholdX == null) {
                    settings.Battery_PickAcceleration_ThresholdX = 0
                } else {
                    settings.Battery_PickAcceleration_ThresholdX = data[i].Battery_PickAcceleration_ThresholdX*100
                }
                if (data[i].Battery_PickAcceleration_ThresholdY == null) {
                    settings.Battery_PickAcceleration_ThresholdY = 0
                } else {
                    settings.Battery_PickAcceleration_ThresholdY = data[i].Battery_PickAcceleration_ThresholdY*100
                }
                if (data[i].Battery_PickAcceleration_ThresholdZ == null) {
                    settings.Battery_PickAcceleration_ThresholdZ = 0
                } else {
                    settings.Battery_PickAcceleration_ThresholdZ = data[i].Battery_PickAcceleration_ThresholdZ*100
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
                Unit.EventCode = 4872
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
    //logger.log("Pick_Acceleration.getBytes() function Started", "info");

  

    let Battery_PickAcceleration_ThresholdX = Converter.Short(data.Battery_PickAcceleration_ThresholdX);
    bytearray = Buffer.concat([bytearray, Battery_PickAcceleration_ThresholdX]);

    let Battery_PickAcceleration_ThresholdY = Converter.Short(data.Battery_PickAcceleration_ThresholdY);
    bytearray = Buffer.concat([bytearray, Battery_PickAcceleration_ThresholdY]);

    let Battery_PickAcceleration_ThresholdZ = Converter.Short(data.Battery_PickAcceleration_ThresholdZ);
    bytearray = Buffer.concat([bytearray, Battery_PickAcceleration_ThresholdZ]);

   
   //logger.log("Pick_Acceleration.getBytes() End", "info");
    return bytearray;
}