import WebFont from 'webfont';

class Fonts{
    load(families) {
        return new Promise((resolve, reject) => {
            WebFont.load({
                google: {
                    families: families
                },
                active: () => {
                    resolve();
                },
                inactive: () => {
                    reject();
                }
            });
        });
    }
}

export default new Fonts();