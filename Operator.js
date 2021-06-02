const getConnection = require('../Config/database.js');
//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
const sql = require('mssql')
const { encode, decode } = require('single-byte');
var Command = require('./Command')

module.exports = {
    main: async function (data,userID) {
        try {
            
            let date = new Date(new Date().toUTCString());
            
            var operator = {};
            let sumMilliSeconds=0;
            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {
                
                let count=1;
                operator.UniqueID = data[i].UniqueID;
                operator.BadgeNumber = data[i].BadgeNo.trim();
                operator.Nickname = (data[i].UploadNickName == "Y" ? data[i].NickName : "")
                //operator.Nickname = data[i].NickName
                let tempAcess=(data[i].AccessLevel == null ? 0 : data[i].AccessLevel)+"";
               // operator.AccessLevel =  tempAcess.charCodeAt();
                operator.AccessLevel =  (data[i].AccessLevel == null ? 0 : data[i].AccessLevel)
                operator.Privileges = 0;
                operator.NormalProfile = 0;
                operator.AlarmProfile = 0;
                operator.Suspension = data[i].Suspended == "Y";
                operator.EmployeeType = 1;
                operator.userID = userID;
                operator.linkData = ""
                operator.linkType = ""
                operator.isDebugSend = false;
                if (data[i].ResetAlarms == "Y") {
                    //operator.Privileges = (Privileges + 1) + "".charCodeAt();
                    operator.Privileges = (operator.Privileges + 1);
                }
                if (data[i].ChangeConfig == "Y") {
                    //operator.Privileges = (Privileges + 2) + "".charCodeAt();
                    operator.Privileges = (operator.Privileges + 2);
                }
                if (data[i].AssetJson != null) {
                    let AssetList = JSON.parse(data[i].AssetJson);
                    for (let j = 0; j < AssetList.length; j++) {
                            let Unit = {}
                            let unixTimeStamp = Math.floor(date.getTime() / 1000);
                            //Unit.ID = AssetList[j].NextPacketID+count;
                            //const request = new sql.Request();
                            //request.input('Destination', AssetList[j].unitUniqueId);
                            //var recordset=await request.query('usp_GetNextPacketID '+AssetList[j].unitUniqueId);    
                       
                            Unit.ID = null//parseInt(recordset.recordset[0].NextPacketID);
                            //console.log("UnitID"+Unit.ID);
                            //count=count+1
                            Unit.Destination = AssetList[j].unitUniqueId
                            Unit.Source = 1,
                            Unit.date = unixTimeStamp;
                            Unit.EventCode =  4162
                            if(AssetList[j].ExpDate!=null){

                                Unit.ExpirationDate = AssetList[j].ExpDate
                                let date2 = new Date(AssetList[j].ExpDate+" 00:00:00");
                                Unit.ExpirationDateTimeStamp = Math.floor(date2.getTime() / 1000);
                            }else{
                                Unit.ExpirationDateTimeStamp = 0;
                            }
                            if(AssetList[j].SameDepartment=='Y'){
                                /// operator.EmployeeType = ((AssetList[j].Trainee=='Y' ? 3 : 1)+"").charCodeAt();
                                operator.EmployeeType = ((AssetList[j].Trainee=='Y' ? 3 : 1))
                             }else{
                                // operator.EmployeeType = ((AssetList[j].Trainee=='Y' ? 4 : 2)+"").charCodeAt();
                                operator.EmployeeType = ((AssetList[j].Trainee=='Y' ? 4 : 2))
                             }
                            Unit.EventData = ToBytes(operator, Unit.ExpirationDateTimeStamp);
                            Unit.CustomEventCode = 0;
                            //Unit.Length = (Unit.EventData.length +"").charCodeAt();
                            Unit.Length = Unit.EventData.length
                            Unit.linkData = ""
                            Unit.linkType = ""
                            Unit.isDebugSend = false;
                            Unit.userID = userID;
                           
                            let date2=new Date(new Date().toUTCString());
                            let mili = date2.getMilliseconds();
                            date2.setMilliseconds(mili+sumMilliSeconds);

                            //console.log(date2)
                            operator.OperatorUtcDate = date2
                            
                            sumMilliSeconds=sumMilliSeconds+600;
                            //  for(let p=0;p<1000;p++){
                            //     console.log(new Date())
                            // }
                            //SendToUnit(Unit,operator);
                            
                           await Command.SendToUnit(Unit,operator);
                      
                    }
                    
                }
            }
            //logger.log("End", "info");
        } catch (err) {
            //logger.log("main() \n" + err, "error");
        }

    }
};
function ToBytes(data, ExpirationDate) {
    try {
        let bytearray =new Buffer.allocUnsafe(0);;
        //logger.log("ToBytes() function Started", "info");
        let bytesShort = Short(data.UniqueID);
        //bytearray = [...bytearray, ...bytesShort];
        bytearray = Buffer.concat([bytearray, bytesShort]);

        //let byteBadgeNo = Integer(data.BadgeNumber.length)
        //bytearray = [...bytearray, ...byteBadgeNo];
        let byteBadgeNo = byte(((data.BadgeNumber)+"").length)
        bytearray = Buffer.concat([bytearray, byteBadgeNo]);

        let byteBadgeNoAscii = Ascii(data.BadgeNumber)
        //bytearray = [...bytearray, ...byteBadgeNoAscii];
        bytearray = Buffer.concat([bytearray, byteBadgeNoAscii]);

        //var buf = Buffer.from(data.Nickname.substring(0, 8), 'utf8');
        //let encodedData = windows1251.encode(data.Nickname.substring(0, 8));
        
        //let byteAsciiNickName = encode('windows-1252', data.Nickname.substring(0, 8));        
        //let byteAsciiNickName = Ascii(data.Nickname.substring(0, 8))
        let name= data.Nickname.substring(0, 8)
        if(name.length<8){
            var padding = Array(9-name.length).join(' ')    
            name+=padding;
        }
        
        let byteAsciiNickName = encode('windows-1252',name );        
        //bytearray = [...bytearray, ...byteAsciiNickName];
        bytearray = Buffer.concat([bytearray, byteAsciiNickName]);

       // let byteAccessLevel = Integer((data.AccessLevel << 4) + data.Privileges)
       let temp1=((data.AccessLevel << 4) + data.Privileges)
       let byteAccessLevel = byte(temp1+"")
        //bytearray = [...bytearray, ...byteAccessLevel];
        bytearray = Buffer.concat([bytearray, byteAccessLevel]);

        let temp2= ((data.NormalProfile << 4) + data.AlarmProfile)
        let byteNormalProfile =byte(temp2+"")
        //bytearray = [...bytearray, ...byteNormalProfile];
        bytearray = Buffer.concat([bytearray, byteNormalProfile]);
        
        let temp3 = ((data.EmployeeType << 4) + (data.Suspension ? 1 : 0))
        let byteEmployeeType = byte(temp3+"")
        //bytearray = [...bytearray, ...byteEmployeeType];
        bytearray = Buffer.concat([bytearray, byteEmployeeType]);

        let byteExpirationDate= Integer(ExpirationDate)
        bytearray = Buffer.concat([bytearray, byteExpirationDate])

        //let ByteExpDate = [00000000, 00000000, 00000000, 00000000]
        //let ByteExpDate =new Buffer.allocUnsafe(4);
        //bytearray.writeInt8(0)
        //bytearray = [...bytearray, ...ByteExpDate];
        //bytearray = Buffer.concat([bytearray, ByteExpDate]);

        //logger.log("ToBytes() function End", "info");

        return bytearray;
    } catch (err) {
        //logger.log("ToBytes() Error \n" + err, "error");
        return [];
    }
}
function byte(data){
    let buf =new Buffer.allocUnsafe(1);
    buf.writeInt8(data)
    return buf;
}
function Short(data) {
    let bytearray = []
    var buf = new Buffer.allocUnsafe(2);
    buf.writeUIntLE(data, 0, 2)
    for (const value of buf.values()) {
        bytearray.push(value);
    }
    //return bytearray.reverse();
    return buf.reverse();
}
function Integer(data) {
    let bytearray = []
    var buf = new Buffer.allocUnsafe(4);
    buf.writeInt32LE(data, 0)
    for (const value of buf.values()) {
        bytearray.push(value);
    }
    //return bytearray;
    return buf.reverse();
}
function UInteger(data) {
    let bytearray = []
    var buf = new Buffer.allocUnsafe(4);
    buf.writeUInt32LE(data, 0)
    for (const value of buf.values()) {
        bytearray.push(value);
    }
    //return bytearray.reverse();
    return buf.reverse();
}
function Ascii(data) {
    let bytearray = []
    var buf = Buffer.from(data, "ascii")
    for (const value of buf.values()) {
        bytearray.push(value);
    }
    //return bytearray;
    return buf;
}

function SendToUnit(Unit,operator) {
    try {
        //logger.log("SendToUnit() function Started", "info");
        let PendingCommand = {}
        let date=new Date(new Date().toUTCString());
        date.setMilliseconds(new Date().getMilliseconds());

        PendingCommand.MessageID = Unit.ID;
        PendingCommand.CommandCode = Unit.EventCode;
        PendingCommand.CommandData = getPacketBytes(Unit);
        PendingCommand.Destination = Unit.Destination;
        PendingCommand.LastQueued = date;
        PendingCommand.FirstTried = date;
        PendingCommand.LastTried =  date;
        PendingCommand.NoOfRetries = 0;
        PendingCommand.IsDNF = false;
        PendingCommand.OperatorUniqueID = operator.UniqueID;
        PendingCommand.CmdNo = null;
        PendingCommand.EventData = Unit.EventData
        
        
        savePendingCommand(PendingCommand,operator);
        //logger.log("SendToUnit() function End", "info");
    } catch (err) {
        //logger.log("SendToUnit() Error \n" + err, "error");
    }
}
function getPacketBytes(data){
    try {
        //logger.log("getPacketBytes() function Started", "info");

        let bytearray =new Buffer.allocUnsafe(0);

        let byteLength = byte((data.EventData.length+16)+"")
        bytearray = Buffer.concat([bytearray, byteLength]);

        let bytesShort = Short(data.ID);
        //bytearray = [...bytearray, ...bytesShort];
        bytearray = Buffer.concat([bytearray, bytesShort]);
   
        let bytesDestination = UInteger(data.Destination);
        //bytearray = [...bytearray, ...bytesDestination];
        bytearray = Buffer.concat([bytearray, bytesDestination]);
        
        let bytesSource = UInteger(data.Source);
        //bytearray = [...bytearray, ...bytesSource];   
        bytearray = Buffer.concat([bytearray, bytesSource]);
        
        let bytesDate = Integer(data.date);
        //bytearray = [...bytearray, ...bytesDate];   
        bytearray = Buffer.concat([bytearray, bytesDate]);

        let bytesEventCode = Short(data.EventCode);
        //bytearray = [...bytearray, ...bytesEventCode];
        bytearray = Buffer.concat([bytearray, bytesEventCode]);

        //bytearray = [...bytearray, ...data.EventData];
        bytearray = Buffer.concat([bytearray, data.EventData]);
        //logger.log("getPacketBytes() function End", "info");
        
        return bytearray;
    } catch (err) {
        //logger.log("getPacketBytes() Error \n" + err, "error");
        return [];
    }
}
async function savePendingCommand(PendingCommand,operator) {
    try {
        console.log("messageID: "+PendingCommand.MessageID+", command: "+ PendingCommand.CommandData)
        let emptyBuffer=new Buffer.allocUnsafe(0);
        
        const request =  new sql.Request();
        //request.input('UniqueID',operator.UniqueID);
        request.input('Destination',sql.BigInt,PendingCommand.Destination);
        request.input('CommandCode',PendingCommand.CommandCode);
        request.input('CommandData',sql.VarBinary,PendingCommand.CommandData);
        request.input('FirstTried',PendingCommand.FirstTried);
        request.input('LastTried',PendingCommand.LastTried);
        request.input('NoOfRetries',PendingCommand.NoOfRetries);
        request.input('LastQueued',PendingCommand.LastTried);
        request.input('IsDNF',PendingCommand.IsDNF);
        request.input('MessageID',PendingCommand.MessageID);
        request.input('LinkData',operator.linkData);
        request.input('LinkType',operator.linkType);
        request.input('Status',null);
        request.input('SentByUserID',operator.userID);
        request.input('OperatorUniqueID',PendingCommand.OperatorUniqueID);
        request.input('CmdNo',PendingCommand.CmdNo);
        request.input('CmdEventData',sql.VarBinary,PendingCommand.EventData);
        request.input('isDebugSend',operator.isDebugSend);
        request.query('USP_InsertPendingCommands @Destination,@CommandCode,@CommandData,@FirstTried,'
        +'@LastTried,@NoOfRetries,@LastQueued,@IsDNF,@MessageID,@LinkData,@LinkType,@Status,@SentByUserID,@OperatorUniqueID,@CmdNo,@CmdEventData,@isDebugSend',
         async function (err, recordset) {
             
            //callback(err, recordset);
        });
    } catch (err) {
        //logger.log("savePendingCommand() Error \n" + err, "error");
       // callback(err, "");
    }
};