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
						//PrevisousData.AdvanceTimerEnabled = PrevisousData.AdvanceTimerEnabled?"Y":"N"
					}
					if(PrevisousData!=null && PrevisousData.AdvanceTimer==data[i].AdvanceTimer &&
						PrevisousData.AdvanceTimerEnabled ==data[i].AdvanceTimerEnabled){
						continue;
					}
					
					var settings = {};
					settings.Time = Converter.Short(data[i].AdvanceTimer)
					settings.Enable = data[i].AdvanceTimerEnabled == "Y"
					
					
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
					Unit.EventCode =  4292,
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
	let Enablebyte = Converter.byte(data.Enable?1:0)
	byte_array = Buffer.concat([byte_array,Enablebyte]);

	byte_array = Buffer.concat([byte_array, data.Time]);

	//logger.log(" getBytes() End", "info")
	return byte_array;
}