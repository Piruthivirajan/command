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
                var datetimesetting = {};
                
                // if (data[i].DateTime == null) {
                //     datetimesetting.DateTime = 0
                // } else {
                    let datetime = new Date(new Date().toUTCString());
                    let unixTimeStamps = Math.floor(datetime.getTime() / 1000);

                    datetimesetting.DateTime = unixTimeStamps
                //}
                if (data[i].TimeZone == null) {
                    datetimesetting.TimeZone = 0
                } else {
                    datetimesetting.TimeZone = data[i].TimeZone
                }
                //if (data[i].DayLight == null || data[i].DayLight==false ||data[i].DayLight==0) {
                 //   datetimesetting.DayLight = 0
                //} else {
                    
                    datetimesetting.DayLight = data[i].IsCurrentlyDst
                //}
              
                datetimesetting.userID = userID;
                datetimesetting.linkData = ""
                datetimesetting.linkType = ""
                datetimesetting.isDebugSend = false;
                datetimesetting.UniqueID = null;

                let Unit = {}
                let date = new Date(new Date().toUTCString());
                let unixTimeStamp = Math.floor(date.getTime() / 1000);
                Unit.ID = data[i].NextPacketID,
                Unit.Destination = data[i].unitUniqueId,
                Unit.Source = 1,
                Unit.date = unixTimeStamp;
                Unit.EventCode =  4122,
                Unit.EventData = getBytes(datetimesetting);
                Unit.CustomEventCode = 0;
                Unit.Length = Unit.EventData.length
                Command.SendToUnit(Unit,datetimesetting);
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
    
    let byteDateTime = Converter.Integer(data.DateTime);
    bytearray = Buffer.concat([bytearray, byteDateTime]);

    let byteTimeZone = Converter.byte(data.TimeZone);
    bytearray = Buffer.concat([bytearray, byteTimeZone]);

    let byteDayLight = Converter.byte(data.DayLight);
    bytearray = Buffer.concat([bytearray, byteDayLight]);


   //logger.log("getBytes() End", "info");
    return bytearray;
}