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
                    data[i].System == 2 ||
                    data[i].System == 3)) {
                    continue;
                }


                var settings = {};
                let OptoInput = data[i].OptoInput != null ? JSON.parse(data[i].OptoInput) : [];
                let num = 0
                let obj = null;
                let obj1 = null;
                let obj2 = null;
                let obj3 = null;
                let obj5 = null;
                settings.Status = 0
                settings.Operation = 0
                settings.HourMeter = 0
                settings.CreateAlarm = 0
                settings.Visibility = 0
                let optoInputArray = []
                if (PrevisousData != null) {

                    if (PrevisousData.optoInputArray != null) {

                        optoInputArray = JSON.parse(PrevisousData.optoInputArray)
                        
                        if(optoInputArray.length>=8 &&  OptoInput.length>=8){
                            optoInputArray[6].Input = PrevisousData.input_two_toggler=="Y"?1:2

                            if(optoInputArray[0].Visible == OptoInput[0].Visible &&
                                optoInputArray[1].Visible == OptoInput[1].Visible &&
                                optoInputArray[2].Visible == OptoInput[2].Visible &&
                                optoInputArray[3].Visible == OptoInput[3].Visible &&
                                optoInputArray[4].Visible == OptoInput[4].Visible &&
                                optoInputArray[5].Visible == OptoInput[5].Visible &&
                                optoInputArray[6].Visible == OptoInput[6].Visible &&
                                optoInputArray[7].Visible == OptoInput[7].Visible && 
                                //
                                optoInputArray[0].Input == OptoInput[0].Input &&
                                optoInputArray[1].Input == OptoInput[1].Input &&
                                optoInputArray[2].Input == OptoInput[2].Input &&
                                optoInputArray[3].Input == OptoInput[3].Input &&
                                optoInputArray[4].Input == OptoInput[4].Input &&
                                optoInputArray[5].Input == OptoInput[5].Input &&
                                optoInputArray[6].Input == OptoInput[6].Input &&
                                optoInputArray[7].Input == OptoInput[7].Input && 
                                // 
                               
                                optoInputArray[0].HourMeter == OptoInput[0].HourMeter &&
                                optoInputArray[1].HourMeter == OptoInput[1].HourMeter &&
                                optoInputArray[2].HourMeter == OptoInput[2].HourMeter &&
                                optoInputArray[3].HourMeter == OptoInput[3].HourMeter &&
                                optoInputArray[4].HourMeter == OptoInput[4].HourMeter &&
                                optoInputArray[5].HourMeter == OptoInput[5].HourMeter &&
                                optoInputArray[6].HourMeter == OptoInput[6].HourMeter &&
                                optoInputArray[7].HourMeter == OptoInput[7].HourMeter && 
                                  // 
                                  optoInputArray[0].Alarm == OptoInput[0].Alarm &&
                                  optoInputArray[1].Alarm == OptoInput[1].Alarm &&
                                  optoInputArray[2].Alarm == OptoInput[2].Alarm &&
                                  optoInputArray[3].Alarm == OptoInput[3].Alarm &&
                                  optoInputArray[4].Alarm == OptoInput[4].Alarm &&
                                  optoInputArray[5].Alarm == OptoInput[5].Alarm &&
                                  optoInputArray[6].Alarm == OptoInput[6].Alarm &&
                                  optoInputArray[7].Alarm == OptoInput[7].Alarm && 
                                   // 
                                   optoInputArray[0].Visible == OptoInput[0].Visible &&
                                   optoInputArray[1].Visible == OptoInput[1].Visible &&
                                   optoInputArray[2].Visible == OptoInput[2].Visible &&
                                   optoInputArray[3].Visible == OptoInput[3].Visible &&
                                   optoInputArray[4].Visible == OptoInput[4].Visible &&
                                   optoInputArray[5].Visible == OptoInput[5].Visible &&
                                   optoInputArray[6].Visible == OptoInput[6].Visible &&
                                   optoInputArray[7].Visible == OptoInput[7].Visible 
                                ){
                                    continue;
                                }
                        }
                    }
                }
                for (let j = 0; j < OptoInput.length; j++) {
                    if (i >= 8) continue;

                    if (OptoInput[j].No > 4 && (!(data[i].System == 1 ||
                        data[i].System == 2))) {
                        //Basic only has first 4 inputs
                        continue;
                    }
                    // if ((OptoInput[j].Input != 0 ? false : OptoInput[j].Input)) {
                    //     obj = 0;
                    // } else {
                    //     obj = 128 >> (num & 31);
                    // }
                    if (OptoInput[j].Visible == "Y") {
                        obj = 128 >> (num & 31);
                    }
                    else {
                        obj = 0;
                    }
                    settings.Status =settings.Status+ obj

                    if ((OptoInput[j].Input != 1 ? false : OptoInput[j].Input)) {
                        obj1 = 128 >> (num & 31);
                    } else {
                        obj1 = 0;
                    }
                    settings.Operation = settings.Operation +obj1
                    if (OptoInput[j].HourMeter == 'Y') {
                        obj2 = 128 >> (num & 31);
                    } else {
                        obj2 = 0;
                    }
                    settings.HourMeter =settings.HourMeter+ obj2
                    if (OptoInput[j].Alarm == "Y") {
                        obj3 = 128 >> (num & 31);
                    }
                    else {
                        obj3 = 0;
                    }
                    settings.CreateAlarm =settings.CreateAlarm + obj3
                    if (OptoInput[j].Visible == "Y") {
                        obj5 = 128 >> (num & 31);
                    }
                    else {
                        obj5 = 0;
                    }
                    settings.Visibility = settings.Visibility+obj5
                    num++;
                }

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
                Unit.EventCode = 4145
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

    let bytesStatus = Converter.byte(data.Status);
    bytearray = Buffer.concat([bytearray, bytesStatus]);

    let bytesOperation= Converter.byte(data.Operation);
    bytearray = Buffer.concat([bytearray, bytesOperation]);

    let bytesHourMeter= Converter.byte(data.HourMeter);
    bytearray = Buffer.concat([bytearray, bytesHourMeter]);

    let bytesCreateAlarm= Converter.byte(data.CreateAlarm);
    bytearray = Buffer.concat([bytearray, bytesCreateAlarm]);

    let bytesVisibility= Converter.byte(data.Visibility);
    bytearray = Buffer.concat([bytearray, bytesVisibility]);    

    //logger.log("getBytes() End", "info");
    return bytearray;
}