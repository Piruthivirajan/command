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
                var sensor = {};
                sensor.ID = 0;
                if(PrevisousData!=null){
                    PrevisousData.SensorEnabled=PrevisousData.SensorEnabled==true?"Y":"N"
                }
                
                if(PrevisousData!=null && PrevisousData.ImpactAlertThresholdX==data[i].ImpactAlertThresholdX &&
                    PrevisousData.ImpactAlarmThresholdX==data[i].ImpactAlarmThresholdX &&
                    PrevisousData.ImpactAlertThresholdY==data[i].ImpactAlertThresholdY &&
                    PrevisousData.ImpactAlarmThresholdY==data[i].ImpactAlarmThresholdY &&
                    PrevisousData.ImpactAlertThresholdZ==data[i].ImpactAlertThresholdZ &&
                    PrevisousData.ImpactAlarmThresholdZ==data[i].ImpactAlarmThresholdZ &&
                    PrevisousData.SamplingX==data[i].SamplingX &&
                    PrevisousData.SamplingY==data[i].SamplingY &&
                    PrevisousData.SamplingZ==data[i].SamplingZ &&
                    PrevisousData.AggressiveThreshold==data[i].AggressiveThreshold &&
                    PrevisousData.AgressiveDuration==data[i].AgressiveDuration &&
                    PrevisousData.SensorEnabled==data[i].SensorEnabled ){
                        
                    continue;
                }
                if (data[i].ImpactAlertThresholdX == null) {
                    sensor.X_Alert = 0
                } else {
                    sensor.X_Alert = data[i].ImpactAlertThresholdX
                }
                if (data[i].ImpactAlarmThresholdX == null) {
                    sensor.X_Alarm = 0
                } else {
                    sensor.X_Alarm = data[i].ImpactAlarmThresholdX
                }
                if (data[i].ImpactAlertThresholdY == null) {
                    sensor.Y_Alert = 0
                } else {
                    sensor.Y_Alert = data[i].ImpactAlertThresholdY
                }
                if (data[i].ImpactAlarmThresholdY == null) {
                    sensor.Y_Alarm = 0
                } else {
                    sensor.Y_Alarm = data[i].ImpactAlarmThresholdY
                }
                if (data[i].ImpactAlertThresholdZ == null) {
                    sensor.Z_Alert = 0
                } else {
                    sensor.Z_Alert = data[i].ImpactAlertThresholdZ
                }
                if (data[i].ImpactAlarmThresholdZ == null) {
                    sensor.Z_Alarm = 0
                } else {
                    sensor.Z_Alarm = data[i].ImpactAlarmThresholdZ
                }
                if (data[i].SamplingX == null) {
                    sensor.X_Sampling = 0
                } else {
                    sensor.X_Sampling = data[i].SamplingX
                }
                if (data[i].SamplingY == null) {
                    sensor.Y_Sampling = 0
                } else {
                    sensor.Y_Sampling = data[i].SamplingY
                }
                if (data[i].SamplingZ == null) {
                    sensor.Z_Sampling = 0
                } else {
                    sensor.Z_Sampling = data[i].SamplingZ
                }
                if (data[i].AggressiveThreshold == null) {
                    sensor.SharpTurningThreshold = 0
                } else {
                    sensor.SharpTurningThreshold = data[i].AggressiveThreshold * 100
                }
                if (data[i].AgressiveDuration == null) {
                    sensor.SharpTurningDuration = 0
                } else {
                    sensor.SharpTurningDuration = data[i].AgressiveDuration
                }
                sensor.Enabled = data[i].SensorEnabled == 'Y'
                sensor.userID = userID;
                sensor.linkData = ""
                sensor.linkType = ""
                sensor.isDebugSend = false;
                sensor.UniqueID = null;

                let Unit = {}
                let date = new Date(new Date().toUTCString());
                let unixTimeStamp = Math.floor(date.getTime() / 1000);
                Unit.ID = data[i].NextPacketID,
                Unit.Destination = data[i].unitUniqueId,
                Unit.Source = 1,
                Unit.date = unixTimeStamp;
                Unit.EventCode =  4193,
                Unit.EventData = getBytes(sensor);
                Unit.CustomEventCode = 0;
                Unit.Length = Unit.EventData.length
                Command.SendToUnit(Unit,sensor);
            }
            //logger.log("End", "info");
        } catch (err) {
            //logger.log("main() \n" + err, "error");
        }

    }
};
function getBytes(data) {
    let bytearray =new Buffer.allocUnsafe(0);;
    //logger.log("Senor.getBytes() function Started", "info");

    let bytesID = Converter.Integer(data.ID);
    bytearray = Buffer.concat([bytearray, bytesID]);

    let bytesX_Alert = Converter.Float(data.X_Alert);
    bytearray = Buffer.concat([bytearray, bytesX_Alert]);

    let bytesX_Alarm = Converter.Float(data.X_Alarm);
    bytearray = Buffer.concat([bytearray, bytesX_Alarm]);

    let  bytesY_Alert = Converter.Float(data.Y_Alert);
    bytearray = Buffer.concat([bytearray, bytesY_Alert]);

    let  bytesY_Alarm = Converter.Float(data.Y_Alarm);
    bytearray = Buffer.concat([bytearray, bytesY_Alarm]);

    let  bytesZ_Alert = Converter.Float(data.Z_Alert);
    bytearray = Buffer.concat([bytearray, bytesZ_Alert]);

    let  bytesZ_Alarm = Converter.Float(data.Z_Alarm);
    bytearray = Buffer.concat([bytearray, bytesZ_Alarm]);

    let  bytesX_Sampling = Converter.Short(data.X_Sampling);
    bytearray = Buffer.concat([bytearray, bytesX_Sampling]);
    
    let  bytesY_Sampling = Converter.Short(data.Y_Sampling);
    bytearray = Buffer.concat([bytearray, bytesY_Sampling]);

    let  bytesZ_Sampling = Converter.Short(data.Z_Sampling);
    bytearray = Buffer.concat([bytearray, bytesZ_Sampling]);

    let  bytesSharpTurningThreshold = Converter.Short(data.SharpTurningThreshold);
    bytearray = Buffer.concat([bytearray, bytesSharpTurningThreshold]);
    
    let  bytesSharpTurningDuration= Converter.Short(data.SharpTurningDuration);
    bytearray = Buffer.concat([bytearray, bytesSharpTurningDuration]);

    let bytesEnabled = Converter.byte(data.Enabled);
    bytearray = Buffer.concat([bytearray, bytesEnabled]);
    //logger.log("Sensor.getBytes() End", "info");
    return bytearray;
}