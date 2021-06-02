//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
const sql = require('mssql')
var Converter = require('./Converter')
var Command = require('./Command')
const { encode, decode } = require('single-byte');


module.exports = {
    main: async function (recordset, userID, PrevisousData) {


        for (let i = 0; i < recordset.length; i++) {
            if (recordset[i].checkList == null) {
                continue
            }

            let question = JSON.parse(recordset[i].checkList);
            if (question.length > 0) {

                var settings = {};
                settings.Supported = question[0].Bilingual == "Y" ? 192 : 128
                if (PrevisousData != null) {
                    if (PrevisousData.checkListnew != null) {
                        let question2 = JSON.parse(PrevisousData.checkListnew);
                        if (question2 != null && question2.length > 0) {
                            if (question2[0].Bilingual == question[0].Bilingual) {
                                continue
                            }
                        }
                    }
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
                Unit.EventCode = 4184
                Unit.EventData = getBytes(settings);
                Unit.CustomEventCode = 0;
                Unit.Length = Unit.EventData.length
                Command.SendToUnit(Unit, settings);
            }
        }

    }
}

function getBytes(data) {
    let byte_array = new Buffer.allocUnsafe(0);
    //logger.log(" getBytes()", "info")


    byte_array = Buffer.concat([byte_array, Converter.byte(data.Supported)]);


    //logger.log(" getBytes()", "info")
    return byte_array;
}
