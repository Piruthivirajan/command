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
                Unit.ID = data[i].NextPacketID,
                Unit.Destination = data[i].unitUniqueId,
                Unit.Source = 1,
                Unit.date = unixTimeStamp;
                Unit.EventCode =  4146
                Unit.CustomEventCode = 0;
                
                let OptoInput=data[i].OptoInput!=null?JSON.parse(data[i].OptoInput):[];
                for(let j=0;j<OptoInput.length;j++){
                
                    if(OptoInput[j].No > 4 && !(data[i].System == 1 ||
                        data[i].System == 2)){
                        continue;
                    }
                    if(j>=9){
                        continue;
                    }
                    
                    if(PrevisousData!=null){
                        if(j==0 && PrevisousData.key==OptoInput[j].InputName){
                            continue
                        }
                        if(j==1 && PrevisousData.occupancy==OptoInput[j].InputName){
                            continue
                        }
                        if(j==2 && PrevisousData.travel==OptoInput[j].InputName){
                            continue
                        }
                        if(j==3 && PrevisousData.lowFule==OptoInput[j].InputName){
                            continue
                        }
                        if(j==4 && PrevisousData.seatBelt==OptoInput[j].InputName){
                            continue
                        }
                        if(j==5 && PrevisousData.input1==OptoInput[j].InputName){
                            continue
                        }
                        if(j==6 && PrevisousData.input2==OptoInput[j].InputName){
                            continue
                        }
                        if(j==7 && PrevisousData.input3==OptoInput[j].InputName){
                            continue
                        }
                    }
                    settings.No = OptoInput[j].No
                    settings.InputName=OptoInput[j].InputName
                    Unit.EventData = getBytes(settings);
                    Unit.Length = Unit.EventData.length    
                    settings.CmdNo= j+1;
                   
                    await Command.SendToUnit(Unit,settings);
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

    let InputNameByte = encode('windows-1252',data.InputName);        
    bytearray = Buffer.concat([bytearray, InputNameByte]);
    
    let first = Converter.byte(13);
    bytearray = Buffer.concat([bytearray, first]);

    let second = Converter.byte(10);
    bytearray = Buffer.concat([bytearray, second]);
    //logger.log("getBytes() End", "info");
    return bytearray;
}