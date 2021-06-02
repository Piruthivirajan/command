//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
var Command = require('./Command')
var Converter = require('./Converter')
module.exports = {
    main: async function (data, userID) {
        try {
            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {

                if (!(data[i].System == 1 || data[i].System == 2
                    || data[i].System == 3 || data[i].System == 4)) {
                    continue;
                }
                var settings = {};
                settings.LongDistanceImperial = data[i].UnitDistance
                settings.TemperatureImperial = data[i].UnitsTemperature
                settings.SpeedImperial = data[i].UnitSpeed
                settings.MassImperial = data[i].UnitsMass
                settings.ShortDistanceImperial = data[i].UnitShortDistance

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
                Unit.EventCode = 4283
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

    let bytesTemperatureImperial = Converter.byte(data.TemperatureImperial);
    bytearray = Buffer.concat([bytearray, bytesTemperatureImperial]);

    let bytesLongDistanceImperial = Converter.byte(data.LongDistanceImperial);
    bytearray = Buffer.concat([bytearray, bytesLongDistanceImperial]);

    let bytesSpeedImperial = Converter.byte(data.SpeedImperial);
    bytearray = Buffer.concat([bytearray, bytesSpeedImperial]);

    let bytesMassImperial = Converter.byte(data.MassImperial);
    bytearray = Buffer.concat([bytearray, bytesMassImperial]);

    if (NewVersion) {
        let bytesShortDistanceImperial = Converter.byte(data.ShortDistanceImperial);
        bytearray = Buffer.concat([bytearray, bytesShortDistanceImperial]);
    }


    //logger.log("getBytes() End", "info");
    return bytearray;
}