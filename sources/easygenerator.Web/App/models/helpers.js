const iterable =  {
    [Symbol.iterator]: function*() {
        for (let key of Object.keys(this)) {
            yield this[key];
        }
    }
}

export { iterable }