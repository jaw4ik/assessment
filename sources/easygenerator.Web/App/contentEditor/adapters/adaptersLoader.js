import modulesLoader from 'modulesLoader';

export default class {
    static async load(adapterPath, adapterActivationData) {
        if (_.isNullOrUndefined(adapterPath)) {
            return null;
        }

        let Adapter = await modulesLoader.import(adapterPath);
        return new Adapter(adapterActivationData);
    }
}