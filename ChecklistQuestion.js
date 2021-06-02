const getConnection = require('../Config/database.js');
//var logger = require("complete-logger");
//logger.init({ output: "Loggers" });
const sql = require('mssql')
var Converter = require('./Converter')
var Command = require('./Command')
const { encode, decode } = require('single-byte');
const Checklist_Question = 4180

module.exports = {
    main: async function (recordset, userID) {
        if (recordset[0].asset != null && recordset[0].checkList != null) {
            let data = JSON.parse(recordset[0].asset);
            let question = JSON.parse(recordset[0].checkList);

            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < question.length; j++) {
                    var settings = {};
                    settings.AlertType = Converter.byte(question[j].Action);

                    let expAnswer = question[j].ExpAnswer;
                    if (expAnswer != null) {
                        settings.ExpectedAnswer = Converter.byte(expAnswer + 1);
                    }
                    else {
                        settings.ExpectedAnswer = 0;
                    }
                    settings.QuestionNo = Converter.Short(question[j].UniqueID);
                    settings.Language = 0; // 0 is for English
                    settings.Question = question[j].Name;
                    settings.Answer1 = question[j].Answer1;
                    settings.Answer2 = question[j].Answer2;
                    settings.Answer3 = question[j].Answer3;
                    settings.Answer4 = question[j].Answer4;
                    if (question[j].SequenceNumber == null) {
                        settings.Sequence = 0;
                    }
                    else {
                        settings.Sequence = question[j].SequenceNumber;
                    }

                    settings.userID = userID;
                    // if (byID.Bilingual == "Y")
                    // {
                    //     var settings1={};
                    //     settings1.AlertType=Converter.byte(question.Action.Value);
                    //     let expAnswer1 = question.ExpAnswer;
                    //         if (expAnswer1!= null)
                    //         {
                    //             settings1.ExpectedAnswer = Converter.byte(expAnswer1 + 1);
                    //         }
                    //         settings1.QuestionNo = Converter.Short(question.UniqueID.Value);
                    //         settings1.Language = 1;//1 is for Spanish
                    //         settings1.Question = question.NameBi;
                    //         settings1.Answer1 = question.Answer1Bi;
                    //         settings1.Answer2 = question.Answer2Bi;
                    //         settings1.Answer3 = question.Answer3Bi;
                    //         settings1.Answer4 = question.Answer4Bi;
                    //         settings1.Sequence = question.SequenceNumber == null ? Converter.short(0) : question.SequenceNumber.Value;
                    // }
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
                    Unit.EventCode = Checklist_Question
                    Unit.EventData = getBytes(settings);
                    Unit.CustomEventCode = 0;
                    Unit.Length = Unit.EventData.length
                    await Command.SendToUnit(Unit, settings);
                }
            }
        }
    }
}

function getBytes(data) {
    let byte_array = new Buffer.allocUnsafe(0);
    //logger.log(" getBytes() Check List Question start", "info")

    let byte = Converter.byte((data.AlertType < 4) + data.ExpectedAnswer);
    byte_array = Buffer.concat([byte_array, byte]);
    let byte_QuestionNo = Converter.Short(data.QuestionNo);
    // let byte_QuestionNo = data.QuestionNo;
    byte_array = Buffer.concat([byte_array, byte_QuestionNo]);


    // new version 

    let byte_sequence = Converter.Short(data.Sequence);
    byte_array = Buffer.concat([byte_array, byte_sequence]);
    byte_array = Buffer.concat([byte_array, Converter.byte(data.Language)]);
    //byte_array.add(Converter.bytedata.Language);
    let encode_Question;
    if (data.Question == null || data.Question == '') {
        encode_Question = '';

    }
    else {
        encode_Question = data.Question.trim();
    }
    byte_array = Buffer.concat([byte_array, encode('windows-1252', encode_Question)]);
    byte_array = Buffer.concat([byte_array, Converter.byte(13)]);
    byte_array = Buffer.concat([byte_array, Converter.byte(10)]);
    if (data.Question == null || data.Question == '') {
        encode_Question = '';

    }
    else {
        encode_Question = data.Question.trim();
    }
    byte_array = Buffer.concat([byte_array, encode('windows-1252', encode_Question)]);
    byte_array = Buffer.concat([byte_array, Converter.byte(13)]);
    byte_array = Buffer.concat([byte_array, Converter.byte(10)]);
    let encode_Answer2;
    if (data.Answer2 == null || data.Answer2 == '') {
        encode_Answer2 = '';

    }
    else {
        encode_Answer2 = data.Answer2.trim();
    }
    byte_array = Buffer.concat([byte_array, encode('windows-1252', encode_Answer2)]);
    byte_array = Buffer.concat([byte_array, Converter.byte(13)]);
    byte_array = Buffer.concat([byte_array, Converter.byte(10)]);

    let encode_Answer3;
    if (data.Answer3 == null || data.Answer3 == '') {
        encode_Answer3 = '';

    }
    else {
        encode_Answer3 = data.Answer3.trim();
    }
    byte_array = Buffer.concat([byte_array, encode('windows-1252', encode_Answer3)]);
    byte_array = Buffer.concat([byte_array, Converter.byte(13)]);
    byte_array = Buffer.concat([byte_array, Converter.byte(10)]);
    let encode_Answer4;
    if (data.Answer4 == null || data.Answer4 == '') {
        encode_Answer4 = '';

    }
    else {
        encode_Answer4 = data.Answer4.trim();
    }
    byte_array = Buffer.concat([byte_array, encode('windows-1252', encode_Answer4)]);
    byte_array = Buffer.concat([byte_array, Converter.byte(13)]);
    byte_array = Buffer.concat([byte_array, Converter.byte(10)]);

    //logger.log(" getBytes() Check List Question End", "info")
    return byte_array;
}
