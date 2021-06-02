//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
var Converter = require('./Converter')
var Command = require('./Command');

module.exports = {
    main: async function (data, userID) {
        try {

            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {
                var status = {};
                if (data[i].Status == 0) {
                    status.Active = 1
                } else {
                    status.Active = 0
                }
                status.userID = userID;
                status.linkData = ""
                status.linkType = ""
                status.isDebugSend = false;
                status.UniqueID = data[i].UniqueID;

                if (data[i].AssetJson != null) {
                    let AssetList = JSON.parse(data[i].AssetJson);
                    for (let j = 0; j < AssetList.length; j++) {
                        let Unit = {}
                        Unit.ID = AssetList[j].NextPacketID,
                        Unit.Destination = AssetList[j].unitUniqueId
                        let date = new Date(new Date().toUTCString());
                        let unixTimeStamp = Math.floor(date.getTime() / 1000);
                        Unit.Source = 1
                        Unit.date = unixTimeStamp;
                        Unit.EventCode =  4164
                        Unit.EventData = getBytes(status);
                        Unit.CustomEventCode = 0;
                        Unit.Length = Unit.EventData.length
                        Command.SendToUnit(Unit,status);
                    }
                }
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

         let bytesUniqueID = Converter.Short(data.UniqueID);
        bytearray = Buffer.concat([bytearray, bytesUniqueID]);

        let bytesStatus = Converter.byte(data.Active);
        bytearray = Buffer.concat([bytearray, bytesStatus]);


    //logger.log("getBytes() End", "info");
    return bytearray;
}