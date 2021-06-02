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
                    // PrevisousData.InspectionEnable = PrevisousData.InspectionEnable ? "Y" : "N"
                }
                if(data[i].MiniCheckList!=null && data[i].MiniCheckList!=''){
                    data[i].MiniCheckList=parseInt(data[i].MiniCheckList)
                }
                if (PrevisousData != null && PrevisousData.InspectionEnable == data[i].InspectionEnable &&
                    PrevisousData.MiniCheckList == data[i].MiniCheckList &&
                    PrevisousData.InspectionFrequency == data[i].InspectionFrequency) {

                    continue;
                }
                var settings = {};
                settings.Frequency = data[i].InspectionEnable == "N" ? 1 : 2
                if( settings.Frequency==1){
                    settings.Repeat = 0;    
                }else{
                    settings.Repeat = data[i].MiniCheckList
                }
                settings.Timer = data[i].InspectionFrequency

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
                Unit.EventCode = 4177
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

    let Frequencybytes = Converter.byte(data.Frequency);

    let Repeatbytes = Converter.Integer(data.Repeat);

    let num = ((Frequencybytes[0] << 4) + Repeatbytes[0] + Repeatbytes[1] + Repeatbytes[2] + Repeatbytes[3])

    let numbytes = Converter.byte(num);
    bytearray = Buffer.concat([bytearray, numbytes]);

    let Timerbytes = Converter.byte(data.Timer);
    bytearray = Buffer.concat([bytearray, Timerbytes]);

    //logger.log("getBytes() End", "info");
    return bytearray;
}