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
					if (PrevisousData != null && PrevisousData.MISCSettingsJson["cmd_1110"]["Maintenance"] == data[i].MISCSettingsJson["cmd_1110"]["Maintenance"] &&
					PrevisousData.MISCSettingsJson["cmd_1110"]["Supervisors"] == data[i].MISCSettingsJson["cmd_1110"]["Supervisors"] &&
					PrevisousData.MISCSettingsJson["cmd_1110"]["Admin"] == data[i].MISCSettingsJson["cmd_1110"]["Admin"] ) {

						continue;
	
					}
	
					settings.Maintenance = data[i].MISCSettingsJson["cmd_1110"]["Maintenance"]
					if(settings.Maintenance!=''){
					settings.Maintenance=settings.Maintenance.split(",").reduce(function(a, b){
						return parseInt(a) +parseInt(b);
					}, 0);
					}
					settings.Supervisors = data[i].MISCSettingsJson["cmd_1110"]["Supervisors"]
					if(settings.Supervisors!=''){
						settings.Supervisors=settings.Supervisors.split(",").reduce(function(a, b){
							return parseInt(a) +parseInt(b);
						}, 0);
					}
					settings.Admin = data[i].MISCSettingsJson["cmd_1110"]["Admin"]
					if(settings.Admin!=''){
						settings.Admin=settings.Admin.split(",").reduce(function(a, b){
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
					Unit.EventCode =  4368,
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
	
	let Maintenance =  Converter.Short(data.Maintenance)
	byte_array = Buffer.concat([byte_array,Maintenance]);

	let Supervisors =  Converter.Short(data.Supervisors)
	byte_array = Buffer.concat([byte_array,Supervisors]);

	let Admin =  Converter.Short(data.Admin)
	byte_array = Buffer.concat([byte_array,Admin]);

	//logger.log(" getBytes() End", "info")
	return byte_array;
}