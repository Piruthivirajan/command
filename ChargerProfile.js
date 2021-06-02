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
            //logger.log("Starting.. Charger Profile", "info");
            for (let i = 0; i < data.length; i++) {
                if (data[i].System == 4) {
                    var settings = {};
                    if (data[i].Battery_ReferenceVoltage_PerCell != null) {
                        settings.V_REF = Converter.Int16(data[i].Battery_ReferenceVoltage_PerCell * 100);
                    }
                    else {
                        settings.V_REF = 0;
                    }
                    if (data[i].Battery_MinCharge_Voltage_PerCell != null) {
                        settings.V_Min = Converter.Int16(data[i].Battery_MinCharge_Voltage_PerCell * 100);
                    }
                    else {
                        settings.V_Min = 0;
                    }
                    if (data[i].Battery_MaxCharge_Voltage_PerCell != null) {
                        settings.V_Max = Converter.Int16(data[i].Battery_MaxCharge_Voltage_PerCell * 100);
                    }
                    else {
                        settings.V_Max = 0;
                    }
                    if (data[i].Battery_MinStart_Voltage_PerCell != null) {
                        settings.BV_Min = Converter.Int16(data[i].Battery_MinStart_Voltage_PerCell * 100);
                    }
                    else {
                        settings.BV_Min = 0;
                    }
                    if (data[i].Battery_MaxStart_Voltage_PerCell != null) {
                        settings.BV_Max = Converter.Int16(data[i].Battery_MaxStart_Voltage_PerCell * 100);
                    }
                    else {
                        settings.BV_Max = 0;
                    }
                    if (data[i].Battery_Max_StartRate != null) {
                        settings.Max_Start_Rate = Converter.Int16(data[i].Battery_Max_StartRate * 100);
                    }
                    else {
                        settings.Max_Start_Rate = 0;
                    }
                    if (data[i].Battery_Finish_Current != null) {
                        settings.Finish_Current = Converter.Int16(data[i].Battery_Finish_Current * 100);
                    }
                    else {
                        settings.Finish_Current = 0;
                    }
                    if (data[i].Battery_Min_EqualizationTime != null) {
                        settings.Min_EQ_Time = Converter.Int16(data[i].Battery_Min_EqualizationTime * 100);
                    }
                    else {
                        settings.Min_EQ_Time = 0;
                    }
                    if (data[i].Battery_Max_Resistance != null) {
                        settings.BR_Max = Converter.Int16(data[i].Battery_Max_Resistance * 100);
                    }
                    else {
                        settings.BR_Max = 0;
                    }
                    if (data[i].Battery_Min_Temperature != null) {
                        settings.B_Temp_Min = Converter.Int16(data[i].Battery_Min_Temperature * 100);
                    }
                    else {
                        settings.B_Temp_Min = 0;
                    }
                    if (data[i].Battery_Max_Temperature != null) {
                        settings.B_Temp_Max = Converter.Int16(data[i].Battery_Max_Temperature * 100);
                    }
                    else {
                        settings.B_Temp_Max = 0;
                    }
                    if (data[i].Battery_Warn_Temperature != null) {
                        settings.B_Temp_Warn = Converter.Int16(data[i].Battery_Warn_Temperature * 100);
                    }
                    else {
                        settings.B_Temp_Warn = 0;
                    }
                    if (data[i].Battery_Max_Current_AboveWarn != null) {
                        settings.I_Max_Warn = Converter.UInteger16(data[i].Battery_Max_Current_AboveWarn);
                    }
                    else {
                        settings.I_Max_Warn = 0;
                    }
                    if (data[i].Battery_AH_FullCharge != null) {
                        settings.AH_To_Full = Converter.UInteger16(data[i].Battery_AH_FullCharge);
                    }
                    else {
                        settings.AH_To_Full = 0;
                    }
                    if (data[i].Battery_AH_Equalization != null) {
                        settings.AH_To_EQ = Converter.UInteger16(data[i].Battery_AH_Equalization);
                    }
                    else {
                        settings.AH_To_EQ = 0;
                    }
                    if (data[i].Battery_Hrs_FullCharge != null) {
                        settings.HRS_To_Full = Converter.UInteger16(data[i].Battery_Hrs_FullCharge);
                    }
                    else {
                        settings.HRS_To_Full = 0;
                    }
                    if (data[i].Battery_Hrs_Equalization != null) {
                        settings.HRS_To_EQ = Converter.UInteger16(data[i].Battery_Hrs_Equalization);
                    }
                    else {
                        settings.HRS_To_EQ = 0;
                    }
                    if (data[i].Battery_ChargeCycles_FullCharge != null) {
                        settings.Cycles_To_Full = Converter.UInteger16(data[i].Battery_ChargeCycles_FullCharge);
                    }
                    else {
                        settings.Cycles_To_Full = 0;
                    }
                    if (data[i].Battery_ChargeCycles_Equalization != null) {
                        settings.Cycles_To_EQ = Converter.UInteger16(data[i].Battery_ChargeCycles_Equalization);
                    }
                    else {
                        settings.Cycles_To_EQ = 0;
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
                    Unit.EventCode = 4874
                    Unit.EventData = getBytes(settings);
                    Unit.CustomEventCode = 0;
                    Unit.Length = Unit.EventData.length
                    Command.SendToUnit(Unit, settings);
                }

                //logger.log("End Charger Profile", "info");

            }
        }
        catch{
            //logger.log("main() \n" + err, "error");
        }
    }

}

function getBytes(data) {
    let bytearray = new Buffer.allocUnsafe(0);;
    //logger.log("getBytes() Charger Profile Started", "info");
    let byte_V_REF = Converter.Short(data.V_REF);
    bytearray = Buffer.concat([bytearray, byte_V_REF]);

    let byte_V_Min = Converter.Short(data.V_Min);
    bytearray = Buffer.concat([bytearray, byte_V_Min]);

    let byte_V_Max = Converter.Short(data.V_Max);
    bytearray = Buffer.concat([bytearray, byte_V_Max]);

    let byte_BV_Min = Converter.Short(data.BV_Min);
    bytearray = Buffer.concat([bytearray, byte_BV_Min]);

    let byte_BV_Max = Converter.Short(data.BV_Max);
    bytearray = Buffer.concat([bytearray, byte_BV_Max]);

    bytearray = Buffer.concat([bytearray, data.Max_Start_Rate]);

    bytearray = Buffer.concat([bytearray, data.Finish_Current]);


    let byte_Min_EQ_Time = Converter.Short(data.Min_EQ_Time);
    bytearray = Buffer.concat([bytearray, byte_Min_EQ_Time]);

    let byte_BR_Max = Converter.Short(data.BR_Max);
    bytearray = Buffer.concat([bytearray, byte_BR_Max]);

    let byte_B_Temp_Min = Converter.Short(data.B_Temp_Min);
    bytearray = Buffer.concat([bytearray, byte_B_Temp_Min]);

    let byte_B_Temp_Max = Converter.Short(data.B_Temp_Max);
    bytearray = Buffer.concat([bytearray, byte_B_Temp_Max]);

    let byte_B_Temp_Warn = Converter.Short(data.B_Temp_Warn);
    bytearray = Buffer.concat([bytearray, byte_B_Temp_Warn]);

    let byte_I_Max_Warn = Converter.Short(data.I_Max_Warn);
    bytearray = Buffer.concat([bytearray, byte_I_Max_Warn]);

    let byte_AH_To_Full = Converter.Short(data.AH_To_Full);
    bytearray = Buffer.concat([bytearray, byte_AH_To_Full]);

    let byte_AH_To_EQ = Converter.Short(data.AH_To_EQ);
    bytearray = Buffer.concat([bytearray, byte_AH_To_EQ]);

    let byte_HRS_To_Full = Converter.Short(data.HRS_To_Full);
    bytearray = Buffer.concat([bytearray, byte_HRS_To_Full]);


    let byte_HRS_To_EQ = Converter.Short(data.HRS_To_EQ);
    bytearray = Buffer.concat([bytearray, byte_HRS_To_EQ]);

    let byte_Cycles_To_Full = Converter.Short(data.Cycles_To_Full);
    bytearray = Buffer.concat([bytearray, byte_Cycles_To_Full]);


    let byte_Cycles_To_EQQ = Converter.Short(data.Cycles_To_EQQ);
    bytearray = Buffer.concat([bytearray, byte_Cycles_To_EQQ]);




    //logger.log("getBytes() Charger Profile End", "info");
    return bytearray;
}