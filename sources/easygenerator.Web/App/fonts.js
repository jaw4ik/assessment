import WebFont from 'webfont';
import constants from 'constants';

class Fonts{
    load(fonts) {
        return new Promise((resolve, reject) => {
            var promises = [];

            var customFonts = _.filter(fonts, (font) => {
                return font.isCustom;
            });

            var defaultFonts = _.without(customFonts);

            promises.push(
                new Promise((resolve, reject) => {
                    var fontLoaderSettings = {            
                        active: () => {
                            resolve();
                        },
                        custom: {
                            families: [],
                            urls: [constants.fonts.customFontUrl]
                        },
                        inactive: () => {
                            reject();
                        }
                    };

                    _.each(fonts, function(font){
                        if(fontLoaderSettings.hasOwnProperty(font.place)) {
                            fontLoaderSettings[font.place].families.push(font.family);
                        } else {
                            fontLoaderSettings[font.place] = {
                                families: [font.family]
                            };
                        }
                    });

                    WebFont.load(fontLoaderSettings);
                })
            );

            var customFontsUrls = _.groupBy(customFonts, (font) => font.place);

            _.each(_.keys(customFontsUrls), (key) => {
                var families = customFontsUrls[key].map((font) => font.family);

                promises.push(
                    new Promise((resolve, reject) => {
                        var fontLoaderSettings = {            
                            active: () => {
                                resolve();
                            },
                            custom: {
                                families: families,
                                urls: [key]
                            },
                            inactive: () => {
                                reject();
                            }
                        };

                        WebFont.load(fontLoaderSettings);
                    })
                );
            });

            return Promise.all(promises).then(
                result => resolve(),
                error => reject()
            );
        });
    }
}

export default new Fonts();