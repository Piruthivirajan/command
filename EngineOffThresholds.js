const getConnection = require('../Config/database.js');
//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
const sql = require('mssql')
var Converter = require('./Converter')
var Command = require('./Command')
const { encode, decode } = require('single-byte');
const SystemOptions_Val_Ultimate = 1;
const SystemOptions_Val_Advanced = 2;
const SystemOptions_Val_Basic = 3;
const Engine_Off_Thresholds = 4276;

module.exports = {
    main: async function (data, userID, PrevisousData) {
        try {
            //logger.log("Starting Engine Off Thresholds", "info");

            for (let i = 0; i < data.length; i++) {
                if (data[i].System == SystemOptions_Val_Ultimate || data[i].System == SystemOptions_Val_Advanced || data[i].System == SystemOptions_Val_Basic) {

                    if (PrevisousData != null) {
                        //PrevisousData.EngineOffEnabled = data[i].EngineOffEnabled ? "Y" : "N"
                    }
                    if (PrevisousData !=null && PrevisousData.EngineOffEnabled == "Y" && PrevisousData.UnitsTemperature == 1) // Fahrenheit:
                    {
        //              metricResults = ((metricResults * 9 / 5) + 32);
                        PrevisousData.Temperature = ((PrevisousData.Temperature - 32) * 5 / 9);
                        PrevisousData.Temperature = parseFloat(parseFloat(PrevisousData.Temperature).toFixed(4))
        
                    }
                    if (PrevisousData != null && PrevisousData.EngineOffEnabled == data[i].EngineOffEnabled &&
                        PrevisousData.Temperature == data[i].Temperature &&
                        PrevisousData.Voltage == data[i].Voltage) {

                        continue;
                    }

                    var settings = {};

                    settings.Enabled = data[i].EngineOffEnabled == "Y";
                    if (data[i].Temperature != null) {
                        settings.Temperature = Math.round(data[i].Temperature * 100);
                        if(settings.Temperature<=0){
                            settings.Temperature=0;
                        }
                        // if(settings.Temperature<0)
                        // {
                        //     settings.Temperature=0;
                        // }
                    }
                    else {
                        settings.Temperature = 0;
                    }
                    if (data[i].Voltage != null) {
                        settings.Voltage = data[i].Voltage * 100;
                    }
                    else {
                        settings.Voltage = 0;
                    }
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
                    Unit.EventCode = Engine_Off_Thresholds
                    Unit.EventData = getBytes(settings);
                    Unit.CustomEventCode = 0;
                    Unit.Length = Unit.EventData.length
                    Command.SendToUnit(Unit, settings);
                }
            }

        }
        catch (err) {
            //logger.log("main() \n" + err, 'error');
        }
    }
}
function getBytes(data) {
    let bytearray = new Buffer.allocUnsafe(0);
    //logger.log('getBytes() Engine Off Thresholds', 'info');

    let bytes = Converter.byte((data.Enabled ? 1 : 0));
    bytearray = Buffer.concat([bytearray, bytes]);

    let bytes_Temperature = Converter.Short(data.Temperature);
    bytearray = Buffer.concat([bytearray, bytes_Temperature]);

    let bytes_Voltage = Converter.Short(data.Voltage);
    bytearray = Buffer.concat([bytearray, bytes_Voltage]);

    //logger.log("getBytes() Engine Off Thresholds End", "info");
    return bytearray;
}