const getConnection = require('../Config/database.js');
//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
const sql = require('mssql')
var Converter = require('./Converter')
var Command = require('./Command')
const { encode, decode } = require('single-byte');
const SystemOptions_Val_Ultimate=1;
const SystemOptions_Val_Advanced=2;
const Skipped_Tests_Allowed = 4183;
module.exports ={
    main : async function(data,userID)
    {
        try{
           for(let i=0; i<data.length; i++) {

                if(data[i].System == SystemOptions_Val_Ultimate || data[i].System == SystemOptions_Val_Advanced)
                {
                    var settings={};
                    if(data[i].AllowedSkippedTests!=null)
                    {
                        settings.Allowed=data[i].AllowedSkippedTests;
                    }
                    else
                    {
                        settings.Allowed=0;
                        
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
                    Unit.EventCode = Skipped_Tests_Allowed;
                    Unit.EventData = getBytes(settings);
                    Unit.CustomEventCode = 0;
                    Unit.Length = Unit.EventData.length
                    Command.SendToUnit(Unit,settings);
                }
    
}
        }
        catch(err)
        {
            //logger.log("main() \n" +err,'error')
        }
    }
}

function getBytes(data)
{
    let byte_array = new Buffer.allocUnsafe(0);
    //logger.log(" getBytes() Skipped Tests Allowed start","info")
    let byte_allowed = Converter.byte(data.Allowed);
    byte_array=Buffer.concat([byte_array,byte_allowed]);
    //logger.log(" getBytes() Skipped Tests Alloed End","info")
    return byte_array;
}