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

					if (PrevisousData != null && PrevisousData.MISCSettingsJson["cmd_110A"]["Bypass"] == data[i].MISCSettingsJson["cmd_110A"]["Bypass"] &&
					PrevisousData.MISCSettingsJson["cmd_110A"]["MaintLockout"] == data[i].MISCSettingsJson["cmd_110A"]["MaintLockout"]){
	
						continue;
					}
	
					settings.Bypass = data[i].MISCSettingsJson["cmd_110A"]["Bypass"]
					if(settings.Bypass!=''){
					settings.Bypass=settings.Bypass.split(",").reduce(function(a, b){
						return parseInt(a) +parseInt(b);
					}, 0);
					}
					settings.MaintLockout = data[i].MISCSettingsJson["cmd_110A"]["MaintLockout"]
					if(settings.MaintLockout!=''){
						settings.MaintLockout=settings.MaintLockout.split(",").reduce(function(a, b){
							return parseInt(a) +parseInt(b);
						}, 0);
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
					Unit.EventCode =  4362
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
	
	// let Bypass =  Converter.byte(data.Bypass)
	// byte_array = Buffer.concat([byte_array,Bypass]);

	// let MaintLockout =  Converter.byte(data.MaintLockout)
	// byte_array = Buffer.concat([byte_array,MaintLockout]);

	let value=((data.MaintLockout << 4) + data.Bypass)
	//let value=((data.MaintLockout) + data.Bypass)
	if(value>=224){
		value=224
	}
	let value2 =  Converter.byte(value)
	byte_array = Buffer.concat([byte_array,value2]);

	//logger.log(" getBytes() End", "info")
	return byte_array;
}