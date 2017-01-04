import Model from '../models/videoModel';

export function map(item = {}) {
    return new Model(item);
};
