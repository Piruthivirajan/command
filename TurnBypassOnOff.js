const getConnection = require('../Config/database.js');
//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
const sql = require('mssql')
var Converter = require('./Converter')
var Command = require('./Command')
const { encode, decode } = require('single-byte');

module.exports = {
    main: async function (data, userID,defaultStatus) {
        try {

            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {
                
                if (!(data[i].System == 1 ||
                    data[i].System == 2))
               {
                  continue;
               }

                var turnbypassonoff = {};
                if (data[i].CurrentMode == 1) {
                    turnbypassonoff.Enabled = 0
                } else {
                    turnbypassonoff.Enabled = 1
                }
                if(defaultStatus){
                    turnbypassonoff.Enabled = 0
                }
                turnbypassonoff.userID = userID;
                turnbypassonoff.linkData = ""
                turnbypassonoff.linkType = ""
                turnbypassonoff.isDebugSend = false;
                turnbypassonoff.UniqueID = null;

                let Unit = {}
                let date = new Date(new Date().toUTCString());
                let unixTimeStamp = Math.floor(date.getTime() / 1000);
                Unit.ID = data[i].NextPacketID,
                Unit.Destination = data[i].unitUniqueId,
                Unit.Source = 1,
                Unit.date = unixTimeStamp;
                Unit.EventCode =  4273,
                Unit.EventData = getBytes(turnbypassonoff);
                Unit.CustomEventCode = 0;
                Unit.Length = Unit.EventData.length
                Command.SendToUnit(Unit,turnbypassonoff);
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
    
        let bytesAlarms = Converter.byte(data.Enabled);
        bytearray = Buffer.concat([bytearray, bytesAlarms]);

    //logger.log("getBytes() End", "info");
    return bytearray;
}