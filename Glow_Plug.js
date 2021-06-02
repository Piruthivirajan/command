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
	
				
					settings.Enabled = data[i].MISCSettingsJson["cmd_110C"]["Enabled"]
					settings.Temp = data[i].MISCSettingsJson["cmd_110C"]["Temp"]

					if (PrevisousData != null && PrevisousData.MISCSettingsJson["cmd_110C"]["Enabled"] == data[i].MISCSettingsJson["cmd_110C"]["Enabled"] &&
					PrevisousData.MISCSettingsJson["cmd_110C"]["Temp"] == data[i].MISCSettingsJson["cmd_110C"]["Temp"]) {
						continue;
					}
					
					settings.Enabled =settings.Enabled =="01"?1:0;
					settings.Temp = settings.Temp ==""?0:settings.Temp *100;

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
					Unit.EventCode = 4364
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

	let Temp =  Converter.Short(data.Temp)
	byte_array = Buffer.concat([byte_array,Temp]);


	//logger.log(" getBytes() End", "info")
	return byte_array;
}