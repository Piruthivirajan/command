//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
var Command = require('./Command')
var Converter = require('./Converter')
module.exports = {
    main: async function (data, userID, PrevisousData) {
        try {
            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {


                if (!(data[i].System == 3 ||
                    (data[i].System == 4 &&
                        data[i].Classification == 161)
                    || (data[i].System == 0 &&
                        data[i].Classification == 161))) {
                    continue;
                }
                if (PrevisousData != null ) {
                  //  PrevisousData.SessionDataEnabled =PrevisousData.SessionDataEnabled?"Y":"N"
                }
                if (PrevisousData != null && PrevisousData.SessionDataEnabled == data[i].SessionDataEnabled) {
                    continue;
                }
                var settings = {};
                settings.SessionDataEnabled = data[i].SessionDataEnabled == "Y" ? 1 : 0;
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
                Unit.EventCode = 4154,
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
    let bytes = Converter.byte(data.SessionDataEnabled);
    bytearray = Buffer.concat([bytearray, bytes]);
    //logger.log("getBytes() End", "info");
    return bytearray;
}