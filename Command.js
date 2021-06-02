const getConnection = require('../Config/database.js');
//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
const sql = require('mssql')
var Converter = require('./Converter')

async function SendToUnit(Unit,Model) {
    try {
        //logger.log("SendToUnit() function Started", "info");
        let PendingCommand = {}
        const request = new sql.Request();
        //request.input('Destination', AssetList[j].unitUniqueId);
        var recordset=await request.query('usp_GetNextPacketID '+Unit.Destination);    
        Unit.ID = parseInt(recordset.recordset[0].NextPacketID);

        PendingCommand.MessageID = Unit.ID;
        PendingCommand.CommandCode = Unit.EventCode;
        // for(let i=0;i<1000000;i++){

        // }
        let date=new Date(new Date().toUTCString());
        Unit.OperatorUniqueID = Model.UniqueID;
        PendingCommand.CommandData = getPacketBytes(Unit);
        PendingCommand.Destination = Unit.Destination;
        date.setMilliseconds(new Date().getMilliseconds());
        PendingCommand.LastQueued = date;
        PendingCommand.FirstTried = date;
        PendingCommand.LastTried = date;
        PendingCommand.NoOfRetries = 0;
        PendingCommand.IsDNF = false;
        PendingCommand.OperatorUniqueID = Model.UniqueID;
        if(Model['CmdNo']){
            PendingCommand.CmdNo = Model.CmdNo;    
        }else{
            PendingCommand.CmdNo = null;
        }
        
        PendingCommand.EventData = Unit.EventData
        PendingCommand.MAXID = Unit.ID;
        
      await  savePendingCommand(PendingCommand,Model);

        //logger.log("SendToUnit() function End", "info");
    } catch (err) {
        //logger.log("SendToUnit() Error \n" + err, "error");
    }
}
function getPacketBytes(data){
    try {
        //logger.log("getPacketBytes() function Started", "info");

        let bytearray =new Buffer.allocUnsafe(0);

        let byteLength = Converter.byte((data.EventData.length+16)+"")
        bytearray = Buffer.concat([bytearray, byteLength]);

        let bytesShort = Converter.Short(data.ID);
        //bytearray = [...bytearray, ...bytesShort];
        bytearray = Buffer.concat([bytearray, bytesShort]);
   
        let bytesDestination = Converter.UInteger(data.Destination);
        //bytearray = [...bytearray, ...bytesDestination];
        bytearray = Buffer.concat([bytearray, bytesDestination]);
        
        let bytesSource = Converter.UInteger(data.Source);
        //bytearray = [...bytearray, ...bytesSource];   
        bytearray = Buffer.concat([bytearray, bytesSource]);
        
        let bytesDate = Converter.Integer(data.date);
        //bytearray = [...bytearray, ...bytesDate];   
        bytearray = Buffer.concat([bytearray, bytesDate]);

        let bytesEventCode = Converter.Short(data.EventCode);
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
async function savePendingCommand(PendingCommand,Model) {
    try {
        let emptyBuffer=new Buffer.allocUnsafe(0);
        
        const request =  new sql.Request();
        //request.input('UniqueID',Model.UniqueID);
        request.input('Destination',sql.BigInt,PendingCommand.Destination);
        request.input('CommandCode',PendingCommand.CommandCode);
        request.input('CommandData',sql.VarBinary,PendingCommand.CommandData);
        request.input('FirstTried',PendingCommand.FirstTried);
        request.input('LastTried',PendingCommand.LastTried);
        request.input('NoOfRetries',PendingCommand.NoOfRetries);
        request.input('LastQueued',PendingCommand.LastTried);
        request.input('IsDNF',PendingCommand.IsDNF);
        request.input('MessageID',PendingCommand.MessageID);
        request.input('LinkData',Model.linkData);
        request.input('LinkType',Model.linkType);
        request.input('Status',null);
        request.input('SentByUserID',Model.userID);
        
        request.input('OperatorUniqueID',PendingCommand.OperatorUniqueID);
        request.input('CmdNo',PendingCommand.CmdNo);
        request.input('CmdEventData',sql.VarBinary,PendingCommand.EventData);
        request.input('isDebugSend',Model.isDebugSend);
        request.input('MAXID',PendingCommand.MAXID);
        await  request.query('USP_InsertPendingCommands @Destination,@CommandCode,@CommandData,@FirstTried,'
        +'@LastTried,@NoOfRetries,@LastQueued,@IsDNF,@MessageID,@LinkData,@LinkType,@Status,@SentByUserID,@OperatorUniqueID,@CmdNo,@CmdEventData,@isDebugSend,@MAXID')
         /*async function (err, recordset) {
			 if(err){
                //logger.log("After savePendingCommand() Error \n" + err, "error");    
             }else{
                //logger.log("After savePendingCommand() Success \n" + err, "info");
             }
             
            
        });*/
    } catch (err) {
        //logger.log("savePendingCommand() Error \n" + err, "error");
    }
};
module.exports = {SendToUnit:SendToUnit}