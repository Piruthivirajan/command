//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
var Converter = require('./Converter')
var Command = require('./Command')
const { encode, decode } = require('single-byte');

module.exports = {
	main: async function (data, userID,PrevisousData) {
		try {

			//logger.log("Starting..", "info");
			for (let i = 0; i < data.length; i++) {
					var settings = {};
	
				
					settings.Message = data[i].MISCSettingsJson["cmd_10BE"]["Message"]
					if (PrevisousData != null && PrevisousData.MISCSettingsJson["cmd_10BE"]["Message"] == data[i].MISCSettingsJson["cmd_10BE"]["Message"]){
	
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
					Unit.EventCode =  4286
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

	byte_array = Buffer.concat([byte_array,encode('windows-1252',data.Message)]);
    byte_array = Buffer.concat([byte_array,Converter.byte(13)]);
	byte_array = Buffer.concat([byte_array,Converter.byte(10)]);
	

	//logger.log(" getBytes() End", "info")
	return byte_array;
}