//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
var Converter = require('./Converter')
var Command = require('./Command')

module.exports = {
    main: async function (recordset, userID,PrevisousData) {


        for (let i = 0; i < recordset.length; i++) {
            if (recordset[i].checkList == null) {
                continue
            }
            
            let question = JSON.parse(recordset[i].checkList);
            var settings = {};
            settings.QuestionNo = []
            for (let j = 0; j < question.length; j++) {


                if (question[j].MiniCheckList == "N") {
                    continue
                }

                settings.QuestionNo.push(Converter.Short(question[j].UniqueID));

            }
            if(settings.QuestionNo.length==0)
            {
                continue
            }
            settings.userID = userID;

            settings.linkData = ""
            settings.linkType = ""
            settings.isDebugSend = false;
            settings.UniqueID = null;

            let Unit = {}
            let date = new Date(new Date().toUTCString());
            let unixTimeStamp = Math.floor(date.getTime() / 1000);
            Unit.ID = recordset[i].NextPacketID
            Unit.Destination = recordset[i].unitUniqueId
            Unit.Source = 1
            Unit.date = unixTimeStamp;
            Unit.EventCode = 4182
            Unit.EventData = getBytes(settings);
            Unit.CustomEventCode = 0;
            Unit.Length = Unit.EventData.length
            Command.SendToUnit(Unit, settings);

        }

    }
}

function getBytes(data) {
    let byte_array = new Buffer.allocUnsafe(0);
    //logger.log(" getBytes()", "info")

    for (let i = 0; i < data.QuestionNo.length; i++) {
        //byte_array = Buffer.concat([byte_array,  Converter.Short(data.QuestionNo[i])]);
        byte_array = Buffer.concat([byte_array,  data.QuestionNo[i]]);
    }
    //logger.log(" getBytes()", "info")
    return byte_array;
}
