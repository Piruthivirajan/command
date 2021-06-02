//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
var Command = require('./Command')
var Converter = require('./Converter')
module.exports = {
    main: async function (data, userID,ALL,PrevisousData) {
        try {
            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {

                if (!(data[i].System == 1 || data[i].System == 2)) {
                    continue;
                }
                if(data[i].CheckListID==null){
                    continue;
                }
                if(PrevisousData.CheckListID==data[i].CheckListID){
                    continue;
                }
                var settings = {};
                settings.UniqueID = 0
                settings.ALL = ALL=="Y"?0:1;
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
                Unit.EventCode = 4178
                Unit.EventData = getBytes(settings, true);
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
function getBytes(data, NewVersion) {
    let bytearray = new Buffer.allocUnsafe(0);;
    //logger.log("getBytes() function Started", "info");

    
    let bytesALL = Converter.byte(data.ALL);
    bytearray = Buffer.concat([bytearray, bytesALL]);

    let bytesUniqueID = Converter.Short(data.UniqueID);
    bytearray = Buffer.concat([bytearray, bytesUniqueID]);

    

    //logger.log("getBytes() End", "info");
    return bytearray;
}