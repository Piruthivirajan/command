const getConnection = require('../Config/database.js');
//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
var Converter = require('./Converter')
var Command = require('./Command')

module.exports = {
    main: async function (data, userID,PrevisousData) {
        try {

            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {

                if(data[i].System!=0 && data[i].System!=3 && data[i].System!=4){
                    continue
                }
                if(data[i].System==4 && data[i].Classification!=161){
                    continue
                }
                if(data[i].System==0 && data[i].Classification!=161){
                    continue
                }
                // if(PrevisousData!=null){
                //     PrevisousData.SessionDataEnabled=PrevisousData.SessionDataEnabled=="Y"
                // }
                if(PrevisousData!=null && PrevisousData.SessionDataEnabled==PrevisousData.SessionDataEnabled){
                    continue;
                }
                var settings = {};
                settings.SessionDataEnabled = data[i].SessionDataEnabled
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
                Unit.EventCode =  4154,
                Unit.EventData = getBytes(settings);
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
function getBytes(data) {
    let bytearray =new Buffer.allocUnsafe(0);;
    //logger.log("getBytes() function Started", "info");

    let bytesSessionDataEnabled = Converter.byte(data.SessionDataEnabled == "Y"?1:0);
    bytearray = Buffer.concat([bytearray, bytesSessionDataEnabled]);

    //logger.log("getBytes() End", "info");
    return bytearray;
}