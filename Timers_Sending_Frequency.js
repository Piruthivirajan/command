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
	
					settings.TimeInMinutes = data[i].MISCSettingsJson["cmd_1109"]["TimeInMinutes"]

					if (PrevisousData != null && PrevisousData.MISCSettingsJson["cmd_1109"]["TimeInMinutes"] == data[i].MISCSettingsJson["cmd_1109"]["TimeInMinutes"]){
	
						continue;
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
					Unit.EventCode =  4361
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
	
	let TimeInMinutes =  Converter.Short(data.TimeInMinutes)
	byte_array = Buffer.concat([byte_array,TimeInMinutes]);


	//logger.log(" getBytes() End", "info")
	return byte_array;
}