import _ from 'underscore';

var execute = () => {
    _.mixin({
        isEmptyOrWhitespace: obj => {
            if (!_.isString(obj))
                throw new TypeError;

            return _.isEmpty(obj.trim());
        },
        isNullOrUndefined: obj => _.isUndefined(obj) || _.isNull(obj),
        isEmptyHtmlText: obj => {
            if (_.isNullOrUndefined(obj)) {
                return true;
            }

            return _.isEmpty(obj
                .replace(/<\/?span[^>]*>/g, '')
                .replace(/<\/?div[^>]*>/g, '')
                .replace(/<\/?p[^>]*>/g, '')
                .replace(/<\/?br[^>]*>/g, '')

                .replace(/\n/g, '')

                .replace(/[\u200B-\u200D\uFEFF]/g, '')
                .replace(/&nbsp;/g, '')
                .trim());
        },
        isDefined: obj => !_.isUndefined(obj)
    });
}

export default { execute };