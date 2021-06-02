const getConnection = require('../Config/database.js');
//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
const sql = require('mssql')
var Converter = require('./Converter')
var Command = require('./Command')

module.exports = {
    main: async function (data, userID,PrevisousData) {
        try {

            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {
                
              
                if(data[i].System!=1 || data[i].PoweredBy!=1){
                    continue
                }
                if(PrevisousData!=null){
                    PrevisousData.FuelTracking=PrevisousData.FuelTracking?"Y":"N"
                }
                if(PrevisousData!=null && PrevisousData.FuelTracking==data[i].FuelTracking
                    && PrevisousData.NoofShortTime==data[i].NoofShortTime
                    && PrevisousData.DebounceTimer==data[i].DebounceTimer
                    && PrevisousData.AlertForTimer==data[i].AlertForTimer
                    && PrevisousData.ShortTime==data[i].ShortTime
                    && PrevisousData.MaintainanceTime==data[i].MaintainanceTime){
                    
                }
                var settings = {};
                settings.Enabled = data[i].FuelTracking == "Y"
                
                if (data[i].NoofShortTime == null) {
                    settings.NoShortTime = 0
                } else {
                    settings.NoShortTime = data[i].NoofShortTime
                }
                if (data[i].DebounceTimer == null) {
                    settings.Debounce = 0
                } else {
                    settings.Debounce = data[i].DebounceTimer
                }
                if (data[i].AlertForTimer == null) {
                    settings.AlertFor = 0
                } else {
                    settings.AlertFor = data[i].AlertForTimer
                }
                if (data[i].ShortTime == null) {
                    settings.ShortTimeDuration = 0
                } else {
                    settings.ShortTimeDuration = data[i].ShortTime
                }
                if (data[i].MaintainanceTime == null) {
                    settings.MaintTime = 0
                } else {
                    settings.MaintTime = data[i].MaintainanceTime
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
                Unit.EventCode =  4198,
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
    
    let bytes = Converter.byte(((data.Enabled ? 1 : 0) << 4)+data.NoShortTime);
    bytearray = Buffer.concat([bytearray, bytes]);

    let byteDebounce = Converter.byte(data.Debounce);
    bytearray = Buffer.concat([bytearray, byteDebounce]);

    let byteAlertFor = Converter.byte(data.AlertFor);
    bytearray = Buffer.concat([bytearray, byteAlertFor]);

    let byteShortTimeDuration = Converter.byte(data.ShortTimeDuration);
    bytearray = Buffer.concat([bytearray, byteShortTimeDuration]);

    let byteMaintTime = Converter.byte(data.MaintTime);
    bytearray = Buffer.concat([bytearray, byteMaintTime]);

   //logger.log("getBytes() End", "info");
    return bytearray;
}