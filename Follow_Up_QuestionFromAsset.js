var Converter = require('./Converter')
var Command = require('./Command')
const { encode, decode } = require('single-byte');
const Follow_Up_Question = 4181

module.exports = {
    main: async function (recordset, userID, PrevisousData) {


        for (let i = 0; i < recordset.length; i++) {
            if (recordset[i].checkList == null) {
                continue
            }
            let data = recordset[i]
            let question = JSON.parse(recordset[i].checkList);

            let question2 = []
            let count = 1;

            // if(PrevisousData!=null){
            //     question2=JSON.parse(PrevisousData.checkList);
            // }
            if (PrevisousData != null) {
                if (PrevisousData.CheckListID == recordset[i].CheckListID) {
                    continue;
                }
            }


            for (let j = 0; j < question.length; j++) {

                let subQuestion = question[j].FollowUpQuestion;
                if(subQuestion!=null){
                    for (let l = 0; l < subQuestion.length; l++) {
                        var settings = {};


                        let expAnswer = question[j].ExpAnswer;
                        if (expAnswer != null) {
                            //settings.ExpectedAnswer = Converter.byte(expAnswer + 1);
                            settings.ExpectedAnswer = (expAnswer + 1);
                        }
                        else {
                            settings.ExpectedAnswer = 0;
                        }
                        settings.FollowupLinkedAnswers = 0;
                        if (expAnswer == 0) {
                            if (subQuestion[l].FIncorrectAnswer1 == "Y") {
                                settings.FollowupLinkedAnswers = 4;
                            }
                            if (subQuestion[l].FIncorrectAnswer2 == "Y") {
                                settings.FollowupLinkedAnswers = settings.FollowupLinkedAnswers+ 2;
                            }
                            if (subQuestion[l].FIncorrectAnswer3 == "Y") {
                                settings.FollowupLinkedAnswers = settings.FollowupLinkedAnswers+ 1;
                            }
                        }
                        else if (expAnswer == 1) {
                            if (subQuestion[l].FIncorrectAnswer1 == "Y") {
                                settings.FollowupLinkedAnswers = 8;
                            }
                            if (subQuestion[l].FIncorrectAnswer2 == "Y") {
                                settings.FollowupLinkedAnswers = settings.FollowupLinkedAnswers+ 2;
                            }
                            if (subQuestion[l].FIncorrectAnswer3 == "Y") {
                                settings.FollowupLinkedAnswers = settings.FollowupLinkedAnswers+ 1;
                            }
                        }
                        else if (expAnswer == 2) {
                            if (subQuestion[l].FIncorrectAnswer1 == "Y") {
                                settings.FollowupLinkedAnswers = 8;
                            }
                            if (subQuestion[l].FIncorrectAnswer2 == "Y") {
                                settings.FollowupLinkedAnswers = settings.FollowupLinkedAnswers+ 4;
                            }
                            if (subQuestion[l].FIncorrectAnswer3 == "Y") {
                                settings.FollowupLinkedAnswers = settings.FollowupLinkedAnswers+ 1;
                            }
                        }
                        else if (expAnswer == 2) {
                            if (subQuestion[l].FIncorrectAnswer1 == "Y") {
                                settings.FollowupLinkedAnswers = 8;
                            }
                            if (subQuestion[l].FIncorrectAnswer2 == "Y") {
                                settings.FollowupLinkedAnswers = settings.FollowupLinkedAnswers+ 4;
                            }
                            if (subQuestion[l].FIncorrectAnswer3 == "Y") {
                                settings.FollowupLinkedAnswers = settings.FollowupLinkedAnswers+ 2;
                            }
                        }
                        //                settings.QuestionNo = Converter.Short(question[j].UniqueID);
                        settings.QuestionNo = subQuestion[l].FUniqueID;
                        settings.FollowupParentQuestionNo = question[j].UniqueID;
                        settings.Language = 0; // 0 is for English
                        settings.Question = subQuestion[l].FName;
                        settings.Answer1 = subQuestion[l].FAnswer1;
                        settings.Answer2 = subQuestion[l].FAnswer2;
                        settings.Answer3 = subQuestion[l].FAnswer3;
                        settings.Answer4 = subQuestion[l].FAnswer4;


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
                        Unit.ID = parseInt(recordset[i].NextPacketID) + count;
                        count = count + 1;
                        Unit.Destination = recordset[i].unitUniqueId
                        Unit.Source = 1
                        Unit.date = unixTimeStamp;
                        Unit.EventCode = Follow_Up_Question
                        Unit.EventData = getBytes(settings);
                        Unit.CustomEventCode = 0;
                        settings.CmdNo =  subQuestion[l].FUniqueID
                        Unit.Length = Unit.EventData.length
                        Command.SendToUnit(Unit, settings);
                    }
                }
            }
        }

    }
}

function getBytes(data) {
    let byte_array = new Buffer.allocUnsafe(0);
    //logger.log(" getBytes() Check List Question start", "info")

    //let byte = Converter.byte((data.AlertType << 4) + data.ExpectedAnswer);
    //byte_array = Buffer.concat([byte_array, byte]);

    let byte_QuestionNo = Converter.Short(data.QuestionNo);
    // let byte_QuestionNo = data.QuestionNo;
    byte_array = Buffer.concat([byte_array, byte_QuestionNo]);

    let byte_FollowupParentQuestionNo = Converter.Short(data.FollowupParentQuestionNo);
    byte_array = Buffer.concat([byte_array, byte_FollowupParentQuestionNo]);

    
    let byte_FollowupLinkedAnswers = Converter.byte(data.FollowupLinkedAnswers);
    byte_array = Buffer.concat([byte_array, byte_FollowupLinkedAnswers]);


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

    let encode_Answer1;
    if (data.Answer1 == null || data.Answer1 == '') {
        encode_Answer1 = '';

    }
    else {
        encode_Answer1 = data.Answer1.trim();
    }
    byte_array = Buffer.concat([byte_array, encode('windows-1252', encode_Answer1)]);
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
