//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
var Command = require('./Command')
var Converter = require('./Converter')

module.exports = {
    main: async function (data, userID, PrevisousData) {
        try {
            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {

                if (!(data[i].System == 1 ||
                    data[i].System == 2)) {
                    continue;
                }
                if (PrevisousData != null) {
                    PrevisousData.CheckListEnable = PrevisousData.CheckListEnable ? "Y" : "N"
                    PrevisousData.CheckListEnableMaint = PrevisousData.CheckListEnableMaint ? "Y" : "N"
                    PrevisousData.CheckListRandomlyEnabled = PrevisousData.CheckListRandomlyEnabled ? "Y" : "N"
                }
                if (PrevisousData != null && PrevisousData.CheckListEnable == data[i].CheckListEnable &&
                    PrevisousData.CheckListEnableMaint == data[i].CheckListEnableMaint &&
                    PrevisousData.CheckListRandomlyEnabled == data[i].CheckListRandomlyEnabled) {

                    continue;
                }
                var settings = {};
                settings.Enabled = data[i].CheckListEnable == "Y"
                settings.MaintLockoutAction = data[i].CheckListEnableMaint == "Y"
                settings.Random = data[i].CheckListRandomlyEnabled == "Y"

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
                Unit.EventCode = 4176,
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
function getBytes(data, newVersion) {
    let bytearray = new Buffer.allocUnsafe(0);;
    //logger.log("getBytes() function Started", "info");
    let Enablebytes = Converter.byte(data.Enabled == true ? 16 : null);

    if (data.MaintLockoutAction) {
        let Maintbytes = Converter.byte(Enablebytes[0] + 1);
        bytearray = Buffer.concat([bytearray, Maintbytes]);
    } else {
        bytearray = Buffer.concat([bytearray, Enablebytes]);
    }
    if (newVersion) {
        let Randombytes = Converter.byte(data.Random);
        bytearray = Buffer.concat([bytearray, Randombytes]);
    }
    //logger.log("getBytes() End", "info");
    return bytearray;
}