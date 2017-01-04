import _ from 'underscore';
import ko from 'knockout';

export default {
    replicateObservableObject(target, source) {
        let prop, srcVal, isObservable = false;
        for (prop in source) {
            if (!source.hasOwnProperty(prop)) { continue; }

            if (ko.isWriteableObservable(source[prop])) {
                isObservable = true;
                srcVal = source[prop]();
            } else if (typeof ( source[prop] ) !== 'function') {
                srcVal = source[prop];
            }

            if ( ko.isWriteableObservable(target[prop])) {
                target[prop](srcVal);
            } else if (_.isNull(target[prop]) || _.isUndefined(target[prop])) {
                target[prop] = isObservable ? ko.observable(srcVal) : srcVal;
            } else if (typeof (target[prop]) !== 'function') {
                target[prop] = srcVal;
            }
            isObservable = false;
        }
        return null;
    },
    cloneObservables(from, to) {
        let json = ko.toJSON(from);
        let js = JSON.parse(json);

        return this.replicateObservableObject(to, js);
    },
    equals(target, source) {
        return ko.toJSON(target) === ko.toJSON(source);
    }		     
}
