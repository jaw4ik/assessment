'use strict';

var config = require('./config');
var DataAdapter = require('./dataAdapter');

class DataManager {
    constructor() {
        this.instances = [];
        for (let key of Object.keys(config)) {
            this.instances.push(new DataAdapter(config[key]));
        }
    }
    *prepare() {
        console.log('-------------------------------------------------------------------------------------------');
        for (let instance of this.instances) {
            yield* instance.killAllConnections();
            yield* instance.deployFromBackups();
            yield* instance.addIdIfNotExists();
            yield* instance.cloneAllTables();
            yield* instance.addTableToStoreChanges();
            yield* instance.addTriggersToWatchChanges();
        }
        console.log('-------------------------------------------------------------------------------------------');
    }
    *restoreFromBackups(){
        for (let instance of this.instances) {
            yield* instance.killAllConnections();
            yield* instance.deployFromBackups();
        }
    }
    *updateBackups() {
        for (let instance of this.instances) {
            yield* instance.updateCurrentBackups();
        }
    }
    close() {
        for (let instance of this.instances) {
            instance.close();
        }
    }
    *resetChanges() {
        for (let instance of this.instances) {
            yield* instance.resetChanges();
        }
    }
}

module.exports = new DataManager();