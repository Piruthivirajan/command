//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
var Command = require('./Command')
var Converter = require('./Converter')

module.exports = {
    main: async function (data, userID,PrevisousData) {
        try {
            //logger.log("Starting..", "info");
            for (let i = 0; i < data.length; i++) {

                if (!(data[i].System == 1 ||
                    data[i].System == 2 ||
                    data[i].System == 3)) {
                    continue;
                }


                var settings = {};
                let OptoInput = data[i].OptoInput != null ? JSON.parse(data[i].OptoInput) : [];
                let num = 0
                let obj = null;
             
                settings.Productivity_Input = 0
      
                if( OptoInput.length>=8){
                    if(PrevisousData!=null){
                        PrevisousData.keyproductivityTogglerButton=PrevisousData.keyproductivityTogglerButton==true?"Y":"N"
                        PrevisousData.occupancyproductivityTogglerButton=PrevisousData.occupancyproductivityTogglerButton==true?"Y":"N"
                        PrevisousData.travelproductivityTogglerButton=PrevisousData.travelproductivityTogglerButton==true?"Y":"N"
                        PrevisousData.lowfuelproductivityTogglerButton=PrevisousData.lowfuelproductivityTogglerButton==true?"Y":"N"
                        PrevisousData.seatbeltproductivityTogglerButton=PrevisousData.seatbeltproductivityTogglerButton==true?"Y":"N"
                        PrevisousData.input_one_productivityTogglerButton=PrevisousData.input_one_productivityTogglerButton==true?"Y":"N"
                        PrevisousData.input_two_productivityTogglerButton=PrevisousData.input_two_productivityTogglerButton==true?"Y":"N"
                        PrevisousData.input_three_productivityTogglerButton=PrevisousData.input_three_productivityTogglerButton==true?"Y":"N"

                    }
                    if(PrevisousData!=null && PrevisousData.keyproductivityTogglerButton==OptoInput[0].Productivity &&
                    PrevisousData.occupancyproductivityTogglerButton==OptoInput[1].Productivity &&
                    PrevisousData.travelproductivityTogglerButton==OptoInput[2].Productivity &&
                    PrevisousData.lowfuelproductivityTogglerButton==OptoInput[3].Productivity &&
                    PrevisousData.seatbeltproductivityTogglerButton==OptoInput[4].Productivity && 
                    PrevisousData.input_one_productivityTogglerButton==OptoInput[5].Productivity &&
                    PrevisousData.input_two_productivityTogglerButton==OptoInput[6].Productivity &&
                    PrevisousData.input_three_productivityTogglerButton==OptoInput[7].Productivity)
                    {
                        continue
                    }
                }
                for (let j = 0; j < OptoInput.length; j++) {
                    if (i >= 8) continue;

                    if (OptoInput[j].No > 4 && (!(data[i].System == 1 ||
                        data[i].System == 2))) {
                        //Basic only has first 4 inputs
                        continue;
                    }
                 
                    
                    if (OptoInput[j].Productivity == 'Y') {
                        obj = 128 >> (num & 31);
                    } else {
                        obj = 0;
                    }
                    settings.Productivity_Input = settings.Productivity_Input+ obj
           
                    num++;
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
                Unit.EventCode = 4152
                Unit.EventData = getBytes(settings);
                Unit.CustomEventCode = 0;
                Unit.Length = Unit.EventData.length
                Command.SendToUnit(Unit, settings);
            }
            //logger.log("End", "info");
        } catch (err) {
            //logger.log("main() \n" + err, "error");
        }

    }
};
function getBytes(data) {
    let bytearray = new Buffer.allocUnsafe(0);;
    //logger.log("getBytes() function Started", "info");

    let ProductivityByte = Converter.byte(data.Productivity_Input);
    bytearray = Buffer.concat([bytearray, ProductivityByte]);


    //logger.log("getBytes() End", "info");
    return bytearray;
}