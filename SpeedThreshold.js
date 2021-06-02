//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
var Command = require('./Command')
var Converter = require('./Converter')

module.exports = {
    main: async function (data, userID,PrevisousData) {
        try {
            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {

                if (!(data[i].System == 1 ||
                    data[i].System == 2))
               {
                  continue;
               }
                var settings = {};
               
                if (PrevisousData != null && PrevisousData.SpeedAllowedPerHour == data[i].SpeedAllowedPerHour &&
                    PrevisousData.SpeedAllowedDuration == data[i].SpeedAllowedDuration &&
                    PrevisousData.AlertForSpeedThresholdAlarm == data[i].AlertForSpeedThresholdAlarm ) {

                    continue;
                }

                settings.Threshold = data[i].SpeedAllowedPerHour == null? 0 : data[i].SpeedAllowedPerHour*100
                settings.Duration = data[i].SpeedAllowedDuration == null? 0 : data[i] .SpeedAllowedDuration
                settings.AlertsToAlarm = data[i].AlertForSpeedThresholdAlarm == null? 0 :data[i] .AlertForSpeedThresholdAlarm
                
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
                Unit.EventCode =  4199,
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
   let num=Converter.Short(Math.round(data.Threshold));
    bytearray = Buffer.concat([bytearray, num]);

    let Durationbytes = Converter.Short(data.Duration);
    bytearray = Buffer.concat([bytearray, Durationbytes]);
    
    let AlertsToAlarmbytes = Converter.byte(data.AlertsToAlarm);
    bytearray = Buffer.concat([bytearray, AlertsToAlarmbytes]);
    
    //logger.log("getBytes() End", "info");
    return bytearray;
}