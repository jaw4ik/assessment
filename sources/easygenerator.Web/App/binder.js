export default class {
    static bindClass(_class) {
        let proto = _class;
        
        while ((proto = Object.getPrototypeOf(proto)) !== Object.prototype) {
            Object.getOwnPropertyNames(proto)
                .filter((prop) => typeof _class[prop] === 'function' && prop !== 'constructor')
                .forEach((method) => _class[method] = _class[method].bind(_class));
        }
    }
}