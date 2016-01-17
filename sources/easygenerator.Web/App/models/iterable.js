export default {
    [Symbol.iterator]: function*() {
        for (let key of Object.keys(this)) {
            yield this[key];
        }
    }
}