import apiHttpWrapper from 'http/apiHttpWrapper';

class SendFeedbackCommand{
    async execute(data) {
        return await apiHttpWrapper.post('api/feedback/neweditor/send', data);;
    }
}

let command = new SendFeedbackCommand();
export default command;