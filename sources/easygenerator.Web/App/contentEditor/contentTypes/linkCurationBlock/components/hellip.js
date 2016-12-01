import _ from 'underscore';

export function cut(hellipStr = '', maxLength = 3) {
    if(_.isString(hellipStr)) { 
        if (hellipStr.length > maxLength) {
            hellipStr = hellipStr.substr(0, maxLength - 3) + '...';
        } 
        return hellipStr;
    }
} 
