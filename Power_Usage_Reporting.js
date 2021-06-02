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

					if ((data[i].System == 3)) {
						continue;
					}
					if(PrevisousData!=null){

						PrevisousData.Charger_PowerUsageReporting= PrevisousData.Charger_PowerUsageReporting? "Y":"N"
					}
					if(PrevisousData!=null && PrevisousData.Charger_PowerUsageReporting==data[i].Charger_PowerUsageReporting){

						continue;
					}
					var settings = {};
					
					settings.Time = data[i].Charger_PowerUsageReporting == "Y"?data[i].Charger_PowerUsageReporting:0
					
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
					Unit.EventCode =  4372,
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

	let time =  Converter.byte(data.Time)
	byte_array = Buffer.concat([byte_array,time]);



	//logger.log(" getBytes() End", "info")
	return byte_array;
}