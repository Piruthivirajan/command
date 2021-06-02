const getConnection = require('../Config/database.js');
//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
const sql = require('mssql')
var Converter = require('./Converter')
var Command = require('./Command')
const { encode, decode } = require('single-byte');
const { parse } = require('path');

module.exports = {
    main: async function (data, userID,PrevisousData) {
        try {

            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {

                if (!(data[i].System == 1 ||
                    data[i].System == 2 ||
                    data[i].System == 3 ||
                    data[i].System == 4))
               {
                  continue;
               }

               var status = {};

               if(PrevisousData!=null && PrevisousData.MISCSettingsJson["cmd_1106"]["Enabled"]==data[i].MISCSettingsJson["cmd_1106"]["Enabled"]){
                   continue;
               }
               
               status.Enabled = data[i].MISCSettingsJson["cmd_1106"]["Enabled"]
               if( status.Enabled==''){
                status.Enabled=0;
               }


               //data[i].UnitModel
                // let gModels = { 12, 22, 32, 102, 202, 302 };//TODO: Remove Hard-coded values
                // let gPlusModels = { 13, 23, 33, 103, 203, 303 };//TODO: Remove Hard-coded values
                 
                 //let UnitModel= data[i].UnitModel==null ? 0 : parseInt(data[i].UnitModel)
                //  status.TimeFrequency = 3600 * 24;
                //  status.DistanceThreshold = 0;
                //  status.DirectionThreshold = 0
                //  status.classification = data[i].AssetTypeClassification==null? 0: data[i].AssetTypeClassification;
                //  PrevisousData.UnitModel = parseInt(PrevisousData.UnitModel)
                //  if(PrevisousData.UnitModel==UnitModel){
                //     continue
                //  }
                //  if(UnitModel==12 || UnitModel==22 || UnitModel==32 || UnitModel==102 || UnitModel==202 || UnitModel==302){
                //     status.Enabled = 1
                //  }else if(UnitModel==13 || UnitModel==23 || UnitModel==33 || UnitModel==103 || UnitModel==203 || UnitModel==303){
                //     status.Enabled = 1
                //  }
                //  else{
                //     status.Enabled = 0
                //  }
              
                status.userID = userID;
                status.linkData = ""
                status.linkType = ""
                status.isDebugSend = false;
                status.UniqueID = null;

                let Unit = {}
                let date = new Date(new Date().toUTCString());
                let unixTimeStamp = Math.floor(date.getTime() / 1000);
                Unit.ID = data[i].NextPacketID,
                Unit.Destination = data[i].unitUniqueId,
                Unit.Source = 1,
                Unit.date = unixTimeStamp;
                Unit.EventCode =  4358,
                Unit.EventData = getBytes(status);
                Unit.CustomEventCode = 0;
                Unit.Length = Unit.EventData.length
                Command.SendToUnit(Unit,status);
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
        
        let bytesStatus = Converter.byte(data.Enabled);
        bytearray = Buffer.concat([bytearray, bytesStatus]);
   

    //logger.log("getBytes() End", "info");
    return bytearray;
}