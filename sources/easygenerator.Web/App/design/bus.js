import Events from 'durandal/events';

export class Bus{
    constructor () {
        Events.includeIn(this);
    }
}

export default new Bus();