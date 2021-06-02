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
	
				
					settings.Enabled = data[i].MISCSettingsJson["cmd_110B"]["Enabled"]
					settings.EnableButton = data[i].MISCSettingsJson["cmd_110B"]["EnableButton"]
					settings.MinOnTime = data[i].MISCSettingsJson["cmd_110B"]["MinOnTime"]
					
					if (PrevisousData != null && PrevisousData.MISCSettingsJson["cmd_110B"]["Enabled"] == data[i].MISCSettingsJson["cmd_110B"]["Enabled"] &&
					PrevisousData.MISCSettingsJson["cmd_110B"]["EnableButton"] == data[i].MISCSettingsJson["cmd_110B"]["EnableButton"]&&
					PrevisousData.MISCSettingsJson["cmd_110B"]["MinOnTime"] == data[i].MISCSettingsJson["cmd_110B"]["MinOnTime"]) {

						continue;
	
					}

					settings.Enabled = 	settings.Enabled =="01"?1:0;

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
					Unit.EventCode = 4363
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
	
	
	let Enabled =  Converter.byte(data.Enabled)
	byte_array = Buffer.concat([byte_array,Enabled]);

	let EnableButton =  Converter.byte(data.EnableButton)
	byte_array = Buffer.concat([byte_array,EnableButton]);

	let MinOnTime =  Converter.byte(data.MinOnTime)
	byte_array = Buffer.concat([byte_array,MinOnTime]);

	//logger.log(" getBytes() End", "info")
	return byte_array;
}