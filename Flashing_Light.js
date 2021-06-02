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

				if (PrevisousData != null && PrevisousData.MISCSettingsJson["cmd_10C1"]["EnabledAlarm"] == data[i].MISCSettingsJson["cmd_10C1"]["EnabledAlarm"]) {

					continue;

				}

				settings.EnabledAlarm = data[i].MISCSettingsJson["cmd_10C1"]["EnabledAlarm"]
				if (settings.EnabledAlarm != '') {
					settings.EnabledAlarm = settings.EnabledAlarm.split(",")
				} else {
					settings.EnabledAlarm = 0
				}

				settings.userID = userID;
				settings.linkData = ""
				settings.linkType = ""
				settings.isDebugSend = false;
				settings.UniqueID = null;

				let Unit = {}
				let date = new Date(new Date().toUTCString());
				let unixTimeStamp = Math.floor(date.getTime() / 1000);
				Unit.ID = data[i].NextPacketID
				Unit.Destination = data[i].unitUniqueId
				Unit.Source = 1
				Unit.date = unixTimeStamp;
				Unit.EventCode = 4289
				Unit.EventData = getBytes(settings);
				Unit.CustomEventCode = 0;
				Unit.Length = Unit.EventData.length
				Command.SendToUnit(Unit, settings);

			}
			//logger.log("End", "info");
		} catch (err) {
			//logger.log("Flashing_Light.main() \n" + err, "error");
		}

	}
};
function getBytes(data) {
	// E - Index : 0 - protected override byte[] ToBytes()

	// E - Index : 1 - {


	// **** 001
	let byte_array = new Buffer.allocUnsafe(0);

	if (data.EnabledAlarm == 0) {
		let EnabledAlarm = Converter.Integer(0)
		byte_array = Buffer.concat([byte_array, EnabledAlarm]);
	}
	else {
		let total = 0;
		for (let i = 0; i < data.EnabledAlarm.length; i++) {
			total = total + parseInt(data.EnabledAlarm[i], 2)
		}
		let value = parseInt(total).toString(2)
		if(value=="10"){
			value="0010"
		}
		else if(value=="1" || value=="01"){
			value="0001"
		}
		else if(value=="100"){
			value="0100"
		}
		else if(value.length==2){
			value="00"+value
		}
		else if(value.length==3){
			value="0"+value
		}
		
		//let EnabledAlarm = Converter.Short(value)
		let EnabledAlarm  = Buffer.from(value, 'hex')
		byte_array = Buffer.concat([byte_array, EnabledAlarm]);
		// for(let j=0;j<value.length;j++){

		// 	let EnabledAlarm  =Converter.byte(value[j])
		// 	byte_array = Buffer.concat([byte_array, EnabledAlarm]);
		// }
		
	}


	//logger.log(" getBytes() End", "info")
	return byte_array;
}