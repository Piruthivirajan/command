const getConnection = require('../Config/database.js');
//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
const sql = require('mssql')
var Converter = require('./Converter')
var Command = require('./Command')
const { encode, decode } = require('single-byte');

module.exports = {
    main: async function (data, userID) {
        try {

            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {
                var settings = {};
                settings.Name = data[i].Name
                
                if (data[i].Battery_BatteryVoltage == null) {
                    settings.Voltage = 0
                } else {
                    settings.Voltage = data[i].Battery_BatteryVoltage
                }
                if (data[i].Battery_NoofCells == null) {
                    settings.NumberofCells = 0
                } else {
                    settings.NumberofCells = data[i].Battery_NoofCells
                }
                if (data[i].Battery_AHCapacity == null) {
                    settings.AHCapacity = 0
                } else {
                    settings.AHCapacity = data[i].Battery_AHCapacity
                }
                if (data[i].Battery_ChargeToOpen == null) {
                    settings.ChargeToOpen = 0
                } else {
                    settings.ChargeToOpen = data[i].Battery_ChargeToOpen
                }
                if (data[i].Battery_DischargeToOpen == null) {
                    settings.DischargeToOpen = 0
                } else {
                    settings.DischargeToOpen = data[i].Battery_DischargeToOpen
                }
                if (data[i].Battery_EQStartRate == null) {
                    settings.EQRate = 0
                } else {
                    settings.EQRate = data[i].Battery_EQStartRate
                }
                if (data[i].Battery_EQFrequency == null) {
                    settings.EqualizationFrequency = 0
                } else {
                    settings.EqualizationFrequency = data[i].Battery_EQFrequency
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
                Unit.EventCode =  4867,
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
    //logger.log("BatteryGeneralSettings.getBytes() function Started", "info");

    let bytesName = encode('windows-1252',data.Name);        
    bytearray = Buffer.concat([bytearray, bytesName]);

    let temp1 = Converter.byte(13+"")
    let temp2 = Converter.byte(10+"")
    bytearray = Buffer.concat([bytearray, temp1]);
    bytearray = Buffer.concat([bytearray, temp2]);

    let bytesVoltage = Converter.Integer(data.Voltage);
    bytearray = Buffer.concat([bytearray, bytesVoltage]);

    let bytesNumberofCells = Converter.Integer(data.NumberofCells);
    bytearray = Buffer.concat([bytearray, bytesNumberofCells]);

    let bytesAHCapacity = Converter.Short(data.AHCapacity);
    bytearray = Buffer.concat([bytearray, bytesAHCapacity]);

    let bytesChargeToOpen = Converter.Short(data.ChargeToOpen);
    bytearray = Buffer.concat([bytearray, bytesChargeToOpen]);

    let bytesDischargeToOpen = Converter.Short(data.DischargeToOpen);
    bytearray = Buffer.concat([bytearray, bytesDischargeToOpen]);

    let bytesEQRate = Converter.Integer(data.EQRate);
    bytearray = Buffer.concat([bytearray, bytesEQRate]);

    let bytesEqualizationFrequency = Converter.Integer(data.EqualizationFrequency);
    bytearray = Buffer.concat([bytearray, bytesEqualizationFrequency]);

   //logger.log("BatteryGeneralSettings.getBytes() End", "info");
    return bytearray;
}