const getConnection = require('../Config/database.js');
//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
const sql = require('mssql')
var Converter = require('./Converter')
var Command = require('./Command')
const New_Battery = 4865;

module.exports = {
    main: async function (data, userID) {
        try {
            //logger.log("Starting New Battery", "info");

            for (let i = 0; i < data.length; i++) {
                if (data[i].System == 4) {

                    var settings = {};

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
                    Unit.EventCode = New_Battery
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
    let byte_array = new Buffer.allocUnsafe(0);
    //logger.log(" getBytes() New Battery start","info")
    //logger.log(" getBytes() New Battery End","info")
    return byte_array;
}