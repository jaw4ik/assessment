import ThemeModel from 'models/theme';

export default {
    map(theme){
        //fix for nulls in json array (see Simple course templateSettings.js)
        var themeSettings = JSON.parse(theme.Settings);
        themeSettings && themeSettings.fonts && removeNullsInArray(themeSettings.fonts);
        themeSettings && themeSettings.branding && themeSettings.branding.colors && removeNullsInArray(themeSettings.branding.colors);
        //end fix
        return new ThemeModel({
            id: theme.Id,
            name: theme.Name,
            settings: themeSettings,
            templateId: theme.TemplateId,
            createdBy: theme.CreatedBy,
            createdOn: new Date(theme.CreatedOn),
            modifiedOn: new Date(theme.ModifiedOn)
        });
    }
};

function removeNullsInArray(array){
    if (array && array.length) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === null) {
                delete array[i];
            }
        }
    }
}
