const getConnection = require('../Config/database.js');
//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
const sql = require('mssql')
var Converter = require('./Converter')
var Command = require('./Command')
const { encode, decode } = require('single-byte');
const SystemOptions_Val_Ultimate = 1;
const SystemOptions_Val_Advanced = 2;
const Numeric_Badge_Entry = 4282;

module.exports ={
    main: async function(data, userID,PrevisousData)
    {
        try{
            //logger.log("Starting Numeric batch entry", "info");
            for (let i = 0; i < data.length; i++) {
                if(!(data[i].System == SystemOptions_Val_Advanced || data[i].System == SystemOptions_Val_Ultimate))
                {
                    continue;
                }
                if (PrevisousData != null) {
                    PrevisousData.NumericBadgeEntry = PrevisousData.NumericBadgeEntry ? "Y" : "N"
                }
                if (PrevisousData != null && PrevisousData.NumericBadgeEntry == data[i].NumericBadgeEntry){

                    continue;
                }

                var settings ={};
               if(data[i].NumericBadgeEntry == "Y")
               {
                settings.Active=true
               }
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
                Unit.EventCode = Numeric_Badge_Entry,
                Unit.EventData = getBytes(settings);
                Unit.CustomEventCode = 0;
                Unit.Length = Unit.EventData.length
                Command.SendToUnit(Unit,settings);
            }
        }
        catch (err) {
            //logger.log("main() \n" + err, 'error');
        }
    }
}
function getBytes(data)
{
    let bytearray = new Buffer.allocUnsafe(0);
    //logger.log('getBytes() Numeric batch entry', 'info');
    let object;
    if(data.Active)
    {
        object=1;

    }
    else
    {
        object=null;
    }
    let bytes_obj=Converter.byte(object);
  //  bytearray = Buffer.concat([bytearray,bytes_obj]);
  bytearray=bytes_obj;
    //logger.log("getBytes() Numeric batch entry End", "info");
    return bytearray;
}