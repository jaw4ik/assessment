import modulesLoader from 'modulesLoader';

export default class {
    static async createContentViewmodel(contentType) {
        let Viewmodel = await modulesLoader.import(`contentEditor/contentTypes/${contentType}/Viewmodel`);
        return new Viewmodel();
    }
}