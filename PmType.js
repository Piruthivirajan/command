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
                    data[i].System == 2 ||
                    data[i].System == 3)) {
                    continue;
                }

                var settings = {};
                var optoInputArray=[]
                let OptoInput = data[i].OptoInput != null ? JSON.parse(data[i].OptoInput) : [];
                let num2 = 0
                let num1 = 0;
                if (PrevisousData != null) {
                    
                    PrevisousData.PM=PrevisousData.PM==true?"Y":"N"

                    if (PrevisousData.optoInputArray != null) {

                        optoInputArray = JSON.parse(PrevisousData.optoInputArray)
                    }
                    if (OptoInput.length >= 8 && optoInputArray.length >= 8) {

                        if(optoInputArray[0].SensePM == OptoInput[0].SensePM &&
                        optoInputArray[1].SensePM == OptoInput[1].SensePM &&
                        optoInputArray[2].SensePM == OptoInput[2].SensePM &&
                        optoInputArray[3].SensePM == OptoInput[3].SensePM &&
                        optoInputArray[4].SensePM == OptoInput[4].SensePM &&
                        optoInputArray[5].SensePM == OptoInput[5].SensePM &&
                        optoInputArray[6].SensePM == OptoInput[6].SensePM &&
                        optoInputArray[7].SensePM == OptoInput[7].SensePM && 
                        //PrevisousData.PM == data[i].PM && 
                        PrevisousData.Frequency == data[i].Frequency &&
                        PrevisousData.OverPM == data[i].OverPM &&
                        PrevisousData.UnderPM == data[i].UnderPM){
                            continue;
                        }
                        
                    }
                }
                settings.Type = 0
                if (data[i].PM == 0) {
                    for (let j = 0; j < OptoInput.length; j++) {

                        if (OptoInput[j].SensePM == 'Y') {

                            num1 = num1 + (128 >> (num2 & 31));
                        }
                        num2++;
                    }
                    settings.Type = num1;
                } if (data[i].PM == 1) {
                    settings.Type = 64;
                }
                settings.Frequency = data[i].Frequency
                settings.OverPM = data[i].OverPM
                settings.UnderPM = data[i].UnderPM


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
                Unit.EventCode = 4147
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

    let numsByte = Converter.byte(data.Type);
    bytearray = Buffer.concat([bytearray, numsByte]);

    let FrequencyByte = Converter.Short(data.Frequency);
    bytearray = Buffer.concat([bytearray, FrequencyByte]);

    let UnderPMByte = Converter.Short(data.UnderPM);
    bytearray = Buffer.concat([bytearray, UnderPMByte]);

    let OverPMByte = Converter.Short(data.OverPM);
    bytearray = Buffer.concat([bytearray, OverPMByte]);

    //logger.log("getBytes() End", "info");
    return bytearray;
}