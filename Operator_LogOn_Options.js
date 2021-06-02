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

					//PrevisousData.LogOnOptionEnabled=PrevisousData.LogOnOptionEnabled == "Y"
				}
				if(PrevisousData!=null && PrevisousData.LogOnOptionEnabled==data[i].LogOnOptionEnabled
					&& PrevisousData.LogOnOptionAllowedTimeToChoose==data[i].LogOnOptionAllowedTimeToChoose
					&& PrevisousData.LogOnOption1==data[i].LogOnOption1
					&& PrevisousData.LogOnOption2==data[i].LogOnOption2
					&& PrevisousData.LogOnOption3==data[i].LogOnOption3
					&& PrevisousData.LogOnOption4==data[i].LogOnOption4 ){
					continue
				}
				var settings = {};
				settings.Enabled = data[i].LogOnOptionEnabled == "Y"
				settings.ChoosingTime = (data[i].LogOnOptionAllowedTimeToChoose == null ? 0 : data[i].LogOnOptionAllowedTimeToChoose);
				settings.Option1 = data[i].LogOnOption1
				settings.Option2 = data[i].LogOnOption2
				settings.Option3 = data[i].LogOnOption3
				settings.Option4 = data[i].LogOnOption4

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
				Unit.EventCode = 4285
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

	// E - Index : 2 - var nums = new List<byte>()

	// E - Index : 3 - {

	// E - Index : 4 - Convert.byte(Enabled ? 1 : 0)

	// E - Index : 5 - };

	// E - Index : 6 - 

	let byte_array = new Buffer.allocUnsafe(0);
	// **** 004-A
	byte_array = Buffer.concat([byte_array, Converter.byte(data.Enabled?1:0)]);
	byte_array = Buffer.concat([byte_array, Converter.byte(data.ChoosingTime)]);
	// E - Index : 8 - 


	// **** 005
	let encode_Option1;
	if (data.Option1 == null || data.Option1 == '') {
		encode_Option1 = '';
	} else {
		encode_Option1 = data.Option1.trim();
	}
	byte_array = Buffer.concat([byte_array, encode('windows-1252', encode_Option1)]);


	// **** 004-A
	byte_array = Buffer.concat([byte_array, Converter.byte(13)]);

	// **** 004-A
	byte_array = Buffer.concat([byte_array, Converter.byte(10)]);

	// **** 005
	let encode_Option2;
	if (data.Option2 == null || data.Option2 == '') {
		encode_Option2 = '';
	} else {
		encode_Option2 = data.Option2.trim();
	}
	byte_array = Buffer.concat([byte_array, encode('windows-1252', encode_Option2)]);


	// **** 004-A
	byte_array = Buffer.concat([byte_array, Converter.byte(13)]);

	// **** 004-A
	byte_array = Buffer.concat([byte_array, Converter.byte(10)]);

	// **** 005
	let encode_Option3;
	if (data.Option3 == null || data.Option3 == '') {
		encode_Option3 = '';
	} else {
		encode_Option3 = data.Option3.trim();
	}
	byte_array = Buffer.concat([byte_array, encode('windows-1252', encode_Option3)]);


	// **** 004-A
	byte_array = Buffer.concat([byte_array, Converter.byte(13)]);

	// **** 004-A
	byte_array = Buffer.concat([byte_array, Converter.byte(10)]);

	// **** 005
	let encode_Option4;
	if (data.Option4 == null || data.Option4 == '') {
		encode_Option4 = '';
	} else {
		encode_Option4 = data.Option4.trim();
	}
	byte_array = Buffer.concat([byte_array, encode('windows-1252', encode_Option4)]);


	// **** 004-A
	byte_array = Buffer.concat([byte_array, Converter.byte(13)]);

	// **** 004-A
	byte_array = Buffer.concat([byte_array, Converter.byte(10)]);
	// E - Index : 22 - } 

	//logger.log(" getBytes() End", "info")
	return byte_array;
}