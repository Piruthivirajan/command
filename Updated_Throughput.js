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
				
				if(data[i].System!=4){
					continue
				}
					var settings = {};
					if(PrevisousData!=null && PrevisousData.Battery_CurrentLife==data[i].Battery_CurrentLife){

						continue;
					}
					
					settings.AmpHours = data[i].Battery_CurrentLife == null?0:data[i].Battery_CurrentLife
					
					
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
					Unit.EventCode =  4866,
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

	// E - Index : 3 - {

	// E - Index : 4 - Convert.byte((this.Enable ? 1 : 0))

	// E - Index : 5 - };

	// E - Index : 6 - nums.AddRange(EndianConverter.GetBytes(Time));

	// E - Index : 8 - } 
	let AmpHours = Converter.byte(data.AmpHours)
	byte_array = Buffer.concat([byte_array,AmpHours]);

	//logger.log(" getBytes() End", "info")
	return byte_array;
}