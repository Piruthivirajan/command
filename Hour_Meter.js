//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
var Command = require('./Command')
const { encode, decode } = require('single-byte');
var Converter = require('./Converter')
module.exports = {
    main: async function (data, userID,PrevisousData) {
        try {
            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {

                var settings = {};
                settings.userID = userID;
                settings.linkData = ""
                settings.linkType = ""
                settings.isDebugSend = false;
                settings.UniqueID = null;

                let Unit = {}
                let date = new Date(new Date().toUTCString());
                let unixTimeStamp = Math.floor(date.getTime() / 1000);
                
                Unit.Destination = data[i].unitUniqueId,
                Unit.Source = 1,
                Unit.date = unixTimeStamp;
                Unit.EventCode =  4153
                Unit.CustomEventCode = 0;
                let count=1;
                let OptoInput=data[i].OptoInput!=null?JSON.parse(data[i].OptoInput):[];
                for(let j=0;j<OptoInput.length;j++){
                    if(OptoInput[j].No > 4 && !(data[i].System == 1 ||
                        data[i].System == 2)){
                        continue;
                    }
                    if(PrevisousData!=null){
                        if(j==0 && PrevisousData.HMR1==OptoInput[j].HMR)
                        {
                            continue;
                        }
                        if(j==1 && PrevisousData.HMR2==OptoInput[j].HMR)
                        {
                            continue;
                        }
                        if(j==2 && PrevisousData.HMR3==OptoInput[j].HMR)
                        {
                            continue;
                        }
                        if(j==3 && PrevisousData.HMR4==OptoInput[j].HMR)
                        {
                            continue;
                        }
                        if(j==4 && PrevisousData.HMR5==OptoInput[j].HMR)
                        {
                            continue;
                        }
                        if(j==5 && PrevisousData.HMR6==OptoInput[j].HMR)
                        {
                            continue;
                        }
                        if(j==6 && PrevisousData.HMR7==OptoInput[j].HMR)
                        {
                            continue;
                        }
                        if(j==7 && PrevisousData.HMR8==OptoInput[j].HMR)
                        {
                            continue;
                        }
                    }
                    Unit.ID = data[i].NextPacketID+count
                    count=count+1
                    settings.No = OptoInput[j].No
                    settings.HMR=OptoInput[j].HMR==null ?0:OptoInput[j].HMR
                    Unit.EventData = getBytes(settings);
                    Unit.Length = Unit.EventData.length    
                    settings.CmdNo = j+1
                    Command.SendToUnit(Unit,settings);
                }
                
            }
            //logger.log("End", "info");
        } catch (err) {
            //logger.log("main() \n" + err, "error");
        }

    }
};
function getBytes(data) {
    let bytearray =new Buffer.allocUnsafe(0);;
    //logger.log("getBytes() function Started", "info");
    
    let bytes = Converter.byte(data.No);
    bytearray = Buffer.concat([bytearray, bytes]);

    let HMR = Converter.Integer(data.HMR);        
    bytearray = Buffer.concat([bytearray, HMR]);
    
    //logger.log("getBytes() End", "info");
    return bytearray;
}