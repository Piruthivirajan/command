//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
var Command = require('./Command')
module.exports = {
    main: async function (data, userID) {
        try {
            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {

                var settings = {};
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
                Unit.EventCode =  4123,
                Unit.EventData = getBytes();
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
function getBytes() {
    let bytearray =new Buffer.allocUnsafe(0);;
    //logger.log("getBytes() function Started", "info");

    //logger.log("getBytes() End", "info");
    return bytearray;
}