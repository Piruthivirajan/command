//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
var Converter = require('./Converter')
var Command = require('./Command')

module.exports = {
    main: async function (data, userID,PrevisousData) {
        try {

            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {

                if (!(data[i].System == 1 || data[i].System == 2)) {
                    continue;
                }
                if(PrevisousData!=null){
                    PrevisousData.LoadSensorEnabled=PrevisousData.LoadSensorEnabled ?"Y":"N"
                }
                if(PrevisousData!=null && PrevisousData.LoadSensorEnabled == data[i].LoadSensorEnabled
                    && PrevisousData.LoadSensorDebounceTimer == data[i].LoadSensorDebounceTimer
                    && PrevisousData.LoadSensorPressureChange == data[i].LoadSensorPressureChange
                    && PrevisousData.LoadSensorWeightThreshold == data[i].LoadSensorWeightThreshold
                    && PrevisousData.LoadSensorOverWeightTimeThreshold == data[i].LoadSensorOverWeightTimeThreshold){

                        continue;
                }
                var settings = {};
                settings.Enabled = data[i].LoadSensorEnabled == "Y"
            
                if (data[i].LoadSensorDebounceTimer == null) {
                    settings.Debounce = 0
                } else {
                    settings.Debounce = data[i].LoadSensorDebounceTimer
                }
                if (data[i].LoadSensorPressureChange == null) {
                    settings.PressureChange = 0
                } else {
                    settings.PressureChange = data[i].LoadSensorPressureChange
                }
                if (data[i].LoadSensorWeightThreshold == null) {
                    settings.WeightThreshold = 0
                } else {
                    settings.WeightThreshold = parseInt(data[i].LoadSensorWeightThreshold * 100)
                }
                if (data[i].LoadSensorOverWeightTimeThreshold == null) {
                    settings.OverweightTimeThreshold = 0
                } else {
                    settings.OverweightTimeThreshold = data[i].LoadSensorOverWeightTimeThreshold
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
                Unit.EventCode =  4200,
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
    
    let bytes = Converter.byte(data.Enabled ? 1 : 0);
    bytearray = Buffer.concat([bytearray, bytes]);

    let byteDebounce = Converter.Short(data.Debounce);
    bytearray = Buffer.concat([bytearray, byteDebounce]);

    let bytePressureChange = Converter.Short(data.PressureChange);
    bytearray = Buffer.concat([bytearray, bytePressureChange]);

    let byteWeightThreshold = Converter.Integer(data.WeightThreshold);
    bytearray = Buffer.concat([bytearray, byteWeightThreshold]);

    let byteOverweightTimeThreshold = Converter.Short(data.OverweightTimeThreshold);
    bytearray = Buffer.concat([bytearray, byteOverweightTimeThreshold]);

   //logger.log("getBytes() End", "info");
    return bytearray;
}