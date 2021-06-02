//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
var Command = require('./Command')
var Converter = require('./Converter')

module.exports = {
    main: async function (data, userID,PrevisousData) {
        try {
            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {

                if (!(data[i].System == 1 ||
                    data[i].System == 2)) {
                    continue;
                }

                var settings = {};
                if (PrevisousData != null) {
                    PrevisousData.MinDurationAlertEnabled = PrevisousData.MinDurationAlertEnabled ? "Y" : "N"
                    PrevisousData.SenseInputsAlertEnabled = PrevisousData.SenseInputsAlertEnabled ? "Y" : "N"
                }
               
                let OptoInput = data[i].OptoInput != null ? JSON.parse(data[i].OptoInput) : [];
                let num = 0
                let num1 = 0;

                let check=true;
                let optoInputArray =[]
                if (PrevisousData != null && PrevisousData.optoInputArray != null) {

                    optoInputArray = JSON.parse(PrevisousData.optoInputArray)
                }
                if (PrevisousData != null && PrevisousData.SenseInputsAlertEnabled == data[i].SenseInputsAlertEnabled) {
                    for (let j = 0; j < OptoInput.length; j++) {
                        if (OptoInput[j].SenseCL == optoInputArray[j].SenseCL) {
                            check=true;
                        }else{
                            check=false
                            break;
                        }
                    }
                }
               
                if (PrevisousData != null && PrevisousData.MinDurationAlertEnabled == data[i].MinDurationAlertEnabled &&
                    PrevisousData.SenseInputsAlertEnabled == data[i].SenseInputsAlertEnabled &&
                    PrevisousData.InspectionMinTime == data[i].InspectionMinTime &&
                    PrevisousData.InspectionMaxTime == data[i].InspectionMaxTime && check==true) {

                    continue;
                }
                if (data[i].SenseInputsAlertEnabled == 'Y') {
                    for (let j = 0; j < OptoInput.length; j++) {

                        if (OptoInput[j].SenseCL == 'Y') {
                            num = num | (128 >> (num1 & 31))
                        }
                        num1++;
                    }
                }
                settings.MinDurationAlert = (data[i].MinDurationAlertEnabled == "N" ? 0 : 1)
                settings.SenseInputsAlert = data[i].SenseInputsAlertEnabled == "Y"
                settings.MinDuration = data[i].InspectionMinTime
                settings.MaxDuration = data[i].InspectionMaxTime
                settings.InputsSet = num

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
                Unit.EventCode = 4179
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

    let nums=((data.MinDurationAlert << 4) + (data.SenseInputsAlert ? 1 : 0))
    let numsByte = Converter.byte(nums);
    bytearray = Buffer.concat([bytearray, numsByte]);

    let minByte=Converter.Short(data.MinDuration)
    bytearray = Buffer.concat([bytearray, minByte]);
    
    let maxByte=Converter.Short(data.MaxDuration)  
    bytearray = Buffer.concat([bytearray, maxByte]);

    let inputByte = Converter.byte(data.InputsSet);
    bytearray = Buffer.concat([bytearray, inputByte]);

    //logger.log("getBytes() End", "info");
    return bytearray;
}