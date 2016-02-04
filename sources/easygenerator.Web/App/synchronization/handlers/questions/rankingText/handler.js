import answerCreated from './eventHandlers/answerCreated.js';
import answerDeleted from './eventHandlers/answerDeleted.js';
import answerTextChanged from './eventHandlers/answerTextChanged.js';
import answersReordered from './eventHandlers/answersReordered.js';

let handler = {
    answerCreated: answerCreated,
    answerDeleted: answerDeleted,
    answerTextChanged: answerTextChanged,
    answersReordered: answersReordered
};

export default handler;