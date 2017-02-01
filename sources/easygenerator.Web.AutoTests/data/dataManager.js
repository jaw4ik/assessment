'use strict';

var config = require('./config');
var DbManager = require('./dbManager');

class DataManager {
    constructor() {
        this.instances = [];
        for (let key of Object.keys(config)) {
            this.instances.push(new DbManager(config[key]));
        }
    }
    *prepare() {
        console.log('-------------------------------------------------------------------------------------------');
        for (let instance of this.instances) {
            yield* instance.killAllConnections();
            yield* instance.deployDbFromBackup();
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
            yield* instance.deployDbFromBackup();
        }
    }
    *updateBackups() {
        for (let instance of this.instances) {
            yield* instance.updateCurrentBackup();
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