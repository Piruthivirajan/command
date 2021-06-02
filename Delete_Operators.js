//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
var Converter = require('./Converter')
var Command = require('./Command');

module.exports = {
    main: async function (data, userID) {
        try {

            let operatorIds = []
            let Unit = {}
            let tempAssetList = []
            for (let i = 0; i < data.length; i++) {
                operatorIds.push(data[i].UniqueID);
            }
            if (operatorIds.length != 0) {
                Unit.EventData = getBytes(operatorIds);
                Unit.Length = Unit.EventData.length
            }
            


            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {
                var status = {};

                status.userID = userID;
                status.linkData = ""
                status.linkType = ""
                status.isDebugSend = false;
                if(data.length==1){
                    status.UniqueID = data[i].UniqueID;
                }
                else{
                    status.UniqueID = null
                }
                

                if (data[i].AssetJson != null) {
                    let AssetList = JSON.parse(data[i].AssetJson);
                    for (let j = 0; j < AssetList.length; j++) {

                        let check = false;
                        for (let n = 0; n < tempAssetList.length; n++) {
                            if (tempAssetList[n].UniqueID == data[i].UniqueID && tempAssetList[n].unitUniqueId == AssetList[j].unitUniqueId) {
                                check = true;
                            }
                            // if (tempAssetList[n].unitUniqueId == AssetList[j].unitUniqueId) {
                            //     check = true;
                            // }
                        }
                        if (check) {
                            continue;
                        }
                        let obj = { UniqueID: data[i].UniqueID, unitUniqueId: AssetList[j].unitUniqueId }
                        tempAssetList.push(obj);


                        Unit.ID = AssetList[j].NextPacketID,
                            Unit.Destination = AssetList[j].unitUniqueId
                        let date = new Date(new Date().toUTCString());
                        let unixTimeStamp = Math.floor(date.getTime() / 1000);
                        Unit.Source = 1
                        Unit.date = unixTimeStamp;
                        Unit.EventCode = 4161
                        Unit.CustomEventCode = 0;
                        Command.SendToUnit(Unit, status);
                    }
                }
            }
            //logger.log("End", "info");
        } catch (err) {
            //logger.log("main() \n" + err, "error");
        }

    }
};
function getBytes(operatorIds) {
    let bytearray = new Buffer.allocUnsafe(0);;
    //logger.log("getBytes() function Started", "info");

    let bytesCount = Converter.byte(operatorIds.length);
    bytearray = Buffer.concat([bytearray, bytesCount]);

    for (let i = 0; i < operatorIds.length; i++) {

        let bytesUniqueID = Converter.Short(operatorIds[i]);
        bytearray = Buffer.concat([bytearray, bytesUniqueID]);
    }
    return bytearray;
}