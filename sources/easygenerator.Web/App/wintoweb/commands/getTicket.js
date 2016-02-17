import apiHttpWrapper from 'http/apiHttpWrapper';
import Command from 'Command';

export default new Command(() => {
    return apiHttpWrapper.post('/api/wintoweb/ticket');
});