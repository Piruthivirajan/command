//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
var Converter = require('./Converter')
var Command = require('./Command')

module.exports = {
	main: async function (data, userID,PrevisousData) {
		try {

			//logger.log("Starting..", "info");
			for (let i = 0; i < data.length; i++) {
					var settings = {};
	
					if (PrevisousData != null && PrevisousData.MISCSettingsJson["cmd_10B5"]["AlarmType"] == data[i].MISCSettingsJson["cmd_10B5"]["AlarmType"] &&
						PrevisousData.MISCSettingsJson["cmd_10B5"]["Inputs"] == data[i].MISCSettingsJson["cmd_10B5"]["Inputs"] &&
						PrevisousData.MISCSettingsJson["cmd_10B5"]["LogoutTimer"] == data[i].MISCSettingsJson["cmd_10B5"]["LogoutTimer"] &&
						PrevisousData.MISCSettingsJson["cmd_10B5"]["LogoutType"] == data[i].MISCSettingsJson["cmd_10B5"]["LogoutType"]){
	
						continue;
					}

					settings.AlarmType = data[i].MISCSettingsJson["cmd_10B5"]["AlarmType"]
					if(settings.AlarmType!=''){
					settings.AlarmType=settings.AlarmType.split(",").reduce(function(a, b){
						return parseInt(a) +parseInt(b);
					}, 0);
					}
					settings.Inputs = data[i].MISCSettingsJson["cmd_10B5"]["Inputs"]
					if(settings.Inputs!='00'){
						settings.Inputs=settings.Inputs.split(",").reduce(function(a, b){
							return parseInt(a) +parseInt(b);
						}, 0);
					}else{
						settings.Inputs=0;
					}
					settings.LogoutTimer = data[i].MISCSettingsJson["cmd_10B5"]["LogoutTimer"]
					settings.LogoutType = data[i].MISCSettingsJson["cmd_10B5"]["LogoutType"]
					
					//settings.LogoutTimer=0;
					//settings.LogoutType=0;

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
					Unit.EventCode =  4277,
					Unit.EventData = getBytes(settings);
					Unit.CustomEventCode = 0;
					Unit.Length = Unit.EventData.length
					Command.SendToUnit(Unit,settings);
				
			}
			//logger.log("End", "info");
		} catch (err) {
			//logger.log("main() \n" + err, "error");
		}

	}
};
function getBytes(data) {
	// E - Index : 0 - protected override byte[] ToBytes()

	// E - Index : 1 - {


	// **** 001
	let byte_array = new Buffer.allocUnsafe(0);
	
	let AlarmType =  Converter.Short(data.AlarmType)
	byte_array = Buffer.concat([byte_array,AlarmType]);
	

	let LogoutType =  Converter.byte(data.LogoutType)
	byte_array = Buffer.concat([byte_array,LogoutType]);

	let Inputs =  Converter.byte(data.Inputs)
	byte_array = Buffer.concat([byte_array,Inputs]);

	let LogoutTimer =  Converter.byte(data.LogoutTimer)
	byte_array = Buffer.concat([byte_array,LogoutTimer]);

	//logger.log(" getBytes() End", "info")
	return byte_array;
}