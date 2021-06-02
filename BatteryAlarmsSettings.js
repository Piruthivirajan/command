const getConnection = require('../Config/database.js');
//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
const sql = require('mssql')
var Converter = require('./Converter')
var Command = require('./Command')
const { encode, decode } = require('single-byte');

module.exports = {
    main: async function (data, userID, PrevisousData) {
        try {

            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {
                var settings = {};
                let num = 0;
                let num1 = 0;
                // if (PrevisousData != null) {
                //     PrevisousData.Battery_MisPick = PrevisousData.Battery_MisPick ? "Y" : "N"
                //     PrevisousData.Battery_LowSoc = PrevisousData.Battery_LowSoc ? "Y" : "N"
                //     PrevisousData.Battery_CableTempSensor = PrevisousData.Battery_CableTempSensor ? "Y" : "N"
                //     PrevisousData.Battery_OverTeperatureAlarm = PrevisousData.Battery_OverTeperatureAlarm ? "Y" : "N"
                //     PrevisousData.Battery_OverCurrentAlarm = PrevisousData.Battery_OverCurrentAlarm ? "Y" : "N"
                //     PrevisousData.Battery_OverVoltageAlarm = PrevisousData.Battery_OverVoltageAlarm ? "Y" : "N"
                //     PrevisousData.Battery_LowVoltageAlarm = PrevisousData.Battery_LowVoltageAlarm ? "Y" : "N"
                //     PrevisousData.Battery_LowWater = PrevisousData.Battery_LowWater ? "Y" : "N"
                // }
                if (PrevisousData != null &&
                    PrevisousData.Battery_MisPick == data[i].Battery_MisPick &&
                    PrevisousData.Battery_LowSoc == data[i].Battery_LowSoc &&
                    PrevisousData.Battery_CableTempSensor == data[i].Battery_CableTempSensor &&
                    PrevisousData.Battery_OverTeperatureAlarm == data[i].Battery_OverTeperatureAlarm &&
                    PrevisousData.Battery_OverCurrentAlarm == data[i].Battery_OverCurrentAlarm &&
                    PrevisousData.Battery_OverVoltageAlarm == data[i].Battery_OverVoltageAlarm &&
                    PrevisousData.Battery_LowVoltageAlarm == data[i].Battery_LowVoltageAlarm &&
                    PrevisousData.Battery_LowWater == data[i].Battery_LowWater &&
                    PrevisousData.Battery_Debounce  == data[i].Battery_Debounce &&
                    PrevisousData.Battery_LowVoltage_Threshold==data[i].Battery_LowVoltage_Threshold &&
                    PrevisousData.Battery_OverVoltage_Threshold ==data[i].Battery_OverVoltage_Threshold &&
                    PrevisousData.Battery_OverCurrent_Threshold  ==data[i].Battery_OverCurrent_Threshold &&
                    PrevisousData.Battery_OverTeperature_Threshold  ==data[i].Battery_OverTeperature_Threshold &&
                    PrevisousData.Battery_LowSoCAlarmThreshold  ==data[i].Battery_LowSoCAlarmThreshold &&
                    PrevisousData.Battery_LowWaterDays  ==data[i].Battery_LowWaterDays &&
                    PrevisousData.Battery_CableTempAlarm_Threshold  ==data[i].Battery_CableTempAlarm_Threshold &&
                    PrevisousData.Battery_MisPickBuzzerDuration  ==data[i].Battery_MisPickBuzzerDuration &&
                    PrevisousData.Battery_LowSoCAlertThreshold  ==data[i].Battery_LowSoCAlertThreshold 
                    
                    
                    ) {
                    continue
                }




                if (data[i].Battery_MisPick == 'Y') {
                    num = num | (128 >> (num1 & 31));
                }
                num1++;
                if (data[i].Battery_LowSoc == 'Y') {
                    num = num | (128 >> (num1 & 31));
                }
                num1++;
                if (data[i].Battery_CableTempSensor == 'Y') {
                    num = num | (128 >> (num1 & 31));
                }
                num1++;
                if (data[i].Battery_OverTeperatureAlarm == 'Y') {
                    num = num | (128 >> (num1 & 31));
                }
                num1++;
                if (data[i].Battery_OverCurrentAlarm == 'Y') {
                    num = num | (128 >> (num1 & 31));
                }
                num1++;
                if (data[i].Battery_OverVoltageAlarm == 'Y') {
                    num = num | (128 >> (num1 & 31));
                }
                num1++;
                if (data[i].Battery_LowVoltageAlarm == 'Y') {
                    num = num | (128 >> (num1 & 31));
                }
                num1++;
                if (data[i].Battery_LowWater == 'Y') {
                    num = num | (128 >> (num1 & 31));
                }
                num1++;
                settings.Alarms = num;
                if (data[i].Battery_Debounce != null) {
                    settings.Debounce = data[i].Battery_Debounce
                } else {
                    settings.Debounce = 0
                }
                if (data[i].Battery_LowVoltageAlarm == "Y" && data[i].Battery_LowVoltage_Threshold != null) {
                    settings.LowVoltage = data[i].Battery_LowVoltage_Threshold
                } else {
                    settings.LowVoltage = 0
                }
                if (data[i].Battery_OverVoltageAlarm == "Y" && data[i].Battery_OverVoltage_Threshold != null) {
                    settings.OverVoltage = data[i].Battery_OverVoltage_Threshold
                } else {
                    settings.OverVoltage = 0
                }
                if (data[i].Battery_OverCurrentAlarm == "Y" && data[i].Battery_OverCurrent_Threshold != null) {
                    settings.OverCurrent = data[i].Battery_OverCurrent_Threshold
                } else {
                    settings.OverCurrent = 0
                }
                if (data[i].Battery_OverTeperatureAlarm == "Y" && data[i].Battery_OverTeperature_Threshold != null) {
                    settings.OverTemp = data[i].Battery_OverTeperature_Threshold * 100
                } else {
                    settings.OverTemp = 0
                }
                settings.SoCCutoff = data[i].Battery_SoCCutoff == "Y"
                if (data[i].Battery_LowSoc == "Y" && data[i].Battery_LowSoCAlarmThreshold != null) {
                    settings.LowSoCalarm = data[i].Battery_LowSoCAlarmThreshold
                } else {
                    settings.LowSoCalarm = 0
                }
                if (data[i].Battery_LowWater == "Y" && data[i].Battery_LowWaterDays != null) {
                    settings.LowWaterDays = data[i].Battery_LowWaterDays
                } else {
                    settings.LowWaterDays = 0
                }
                if (data[i].Battery_CableTempSensor == "Y" && data[i].Battery_CableTempAlarm_Threshold != null) {
                    settings.CableTemp = data[i].Battery_CableTempAlarm_Threshold * 100
                } else {
                    settings.CableTemp = 0
                }
                if (data[i].Battery_MisPick == "Y" && data[i].Battery_MisPickBuzzerDuration != null) {
                    settings.MispickAlarm = data[i].Battery_MisPickBuzzerDuration
                } else {
                    settings.MispickAlarm = 0
                }

                if (data[i].Battery_LowSoc == "Y" && data[i].Battery_LowSoCAlertThreshold != null) {
                    settings.LowSoCalert = data[i].Battery_LowSoCAlertThreshold
                } else {
                    settings.LowSoCalert = 0
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
                Unit.EventCode = 4868,
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

    let bytesAlarms = Converter.byte(data.Alarms);
    bytearray = Buffer.concat([bytearray, bytesAlarms]);

    let bytesDebounce = Converter.byte(data.Debounce);
    bytearray = Buffer.concat([bytearray, bytesDebounce]);

    let bytesLowVoltage = Converter.byte(data.LowVoltage);
    bytearray = Buffer.concat([bytearray, bytesLowVoltage]);

    let bytesOverVoltage = Converter.byte(data.OverVoltage);
    bytearray = Buffer.concat([bytearray, bytesOverVoltage]);

    let bytesOverCurrent = Converter.Short(data.OverCurrent);
    bytearray = Buffer.concat([bytearray, bytesOverCurrent]);

    let bytesOverTemp = Converter.Short(data.OverTemp);
    bytearray = Buffer.concat([bytearray, bytesOverTemp]);

    let bytesSoCCutoff = Converter.byte(data.SoCCutoff ? 1 : 0);
    bytearray = Buffer.concat([bytearray, bytesSoCCutoff]);

    let bytesLowSoCalarm = Converter.byte(data.LowSoCalarm);
    bytearray = Buffer.concat([bytearray, bytesLowSoCalarm]);

    let bytesLowWaterDays = Converter.byte(data.LowWaterDays);
    bytearray = Buffer.concat([bytearray, bytesLowWaterDays]);

    let bytesCableTemp = Converter.Short(data.CableTemp);
    bytearray = Buffer.concat([bytearray, bytesCableTemp]);

    let bytesLowSoCalert = Converter.byte(data.LowSoCalert);
    bytearray = Buffer.concat([bytearray, bytesLowSoCalert]);

    let bytesMispickAlarm = Converter.byte(data.MispickAlarm);
    bytearray = Buffer.concat([bytearray, bytesMispickAlarm]);

    //logger.log("getBytes() End", "info");
    return bytearray;
}