const getConnection = require('../Config/database.js');
//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
const sql = require('mssql')
var Converter = require('./Converter')
var Command = require('./Command')
const { encode, decode } = require('single-byte');

module.exports = {
    main: async function (data, userID,PrevisousData) {
        try {

            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {

                if (!(data[i].System == 1 ||
                    data[i].System == 2 ||
                    data[i].System == 3 ||
                    data[i].System == 4)) {
                    continue;
                }
                //data[i].UnitModel
                // let gModels = { 12, 22, 32, 102, 202, 302 };//TODO: Remove Hard-coded values
                // let gPlusModels = { 13, 23, 33, 103, 203, 303 };//TODO: Remove Hard-coded values
                var status = {};
                //let UnitModel = data[i].UnitModel == null ? 0 : parseInt(data[i].UnitModel)
                status.TimeFrequency = 3600 * 24;
                status.DistanceThreshold = 0;
                status.DirectionThreshold = 0
                let flag = true;
                //status.classification = data[i].AssetTypeClassification == null ? 0 : data[i].AssetTypeClassification;

                // if (UnitModel == 12 || UnitModel == 22 || UnitModel == 32 || UnitModel == 102 || UnitModel == 202 || UnitModel == 302) {
                //     flag = false;
                //     status.TimeFrequency = 3600 * 24;
                //     status.DistanceThreshold = 0;
                //     status.DirectionThreshold = 0
                // } else if (UnitModel == 13 || UnitModel == 23 || UnitModel == 33 || UnitModel == 103 || UnitModel == 203 || UnitModel == 303) {
                //     flag = false;
                //     if (status.classification == 1) {
                //         status.TimeFrequency = 0;
                //         status.DistanceThreshold = 10000;
                //         status.DirectionThreshold = 30
                //     } else if (status.classification == 2) {
                //         status.TimeFrequency = 0;
                //         status.DistanceThreshold = 20000;
                //         status.DirectionThreshold = 30
                //     } else if (status.classification == 4) {
                //         status.TimeFrequency = 0;
                //         status.DistanceThreshold = 60000;
                //         status.DirectionThreshold = 45
                //     } else if (status.classification == 5) {
                //         status.TimeFrequency = 0;
                //         status.DistanceThreshold = 20000;
                //         status.DirectionThreshold = 30
                //     } else if (status.classification == 3) {
                //         status.TimeFrequency = 0;
                //         status.DistanceThreshold = 20000;
                //         status.DirectionThreshold = 30
                //     } else {
                //         status.TimeFrequency = 0;
                //         status.DistanceThreshold = 10000;
                //         status.DirectionThreshold = 30
                //     }
                // }
                // if (flag) {
                //     continue;
                // }
                let metricResult =''

                if(PrevisousData!=null && data[i].MISCSettingsJson["cmd_1082"]["DistanceThreshold"]==PrevisousData.MISCSettingsJson["cmd_1082"]["DistanceThreshold"]
                && data[i].MISCSettingsJson["cmd_1082"]["DirectionThreshold"]==PrevisousData.MISCSettingsJson["cmd_1082"]["DirectionThreshold"]
                && data[i].MISCSettingsJson["cmd_1082"]["TimeFrequency"]==PrevisousData.MISCSettingsJson["cmd_1082"]["TimeFrequency"]){
                    continue
                }
                status.DistanceThreshold = data[i].MISCSettingsJson["cmd_1082"]["DistanceThreshold"]
                if(status.DistanceThreshold!=''){

                   
                    if( status.DistanceThreshold!=''){
                      metricResult = parseFloat( status.DistanceThreshold)
                    }
                    //status.DistanceThreshold=Math.round(1770278.4)
                    status.DistanceThreshold=Math.round((metricResult*1000)*100.00)
                    //status.DistanceThreshold=status.DistanceThreshold*100;
                }
                status.DirectionThreshold = data[i].MISCSettingsJson["cmd_1082"]["DirectionThreshold"]
                if(status.DirectionThreshold!=''){
                    status.DirectionThreshold=parseInt(status.DirectionThreshold)
                }
                status.TimeFrequency = data[i].MISCSettingsJson["cmd_1082"]["TimeFrequency"]

                if(status.TimeFrequency!=''){
                    status.TimeFrequency=parseInt(status.TimeFrequency)
                }



                status.userID = userID;
                status.linkData = ""
                status.linkType = ""
                status.isDebugSend = false;
                status.UniqueID = null;

                let Unit = {}
                let date = new Date(new Date().toUTCString());
                let unixTimeStamp = Math.floor(date.getTime() / 1000);
                Unit.ID = data[i].NextPacketID
                Unit.Destination = data[i].unitUniqueId
                Unit.Source = 1
                Unit.date = unixTimeStamp;
                Unit.EventCode = 4226
                Unit.EventData = getBytes(status);
                Unit.CustomEventCode = 0;
                Unit.Length = Unit.EventData.length
                Command.SendToUnit(Unit, status);
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

    let byteTimeFrequency = Converter.Integer(data.TimeFrequency);
    bytearray = Buffer.concat([bytearray, byteTimeFrequency]);

    let byteDistanceThreshold = Converter.Integer(data.DistanceThreshold);
    bytearray = Buffer.concat([bytearray, byteDistanceThreshold]);

    let byteDirectionThreshold = Converter.Short(data.DirectionThreshold);
    bytearray = Buffer.concat([bytearray, byteDirectionThreshold]);


    //logger.log("getBytes() End", "info");
    return bytearray;
}