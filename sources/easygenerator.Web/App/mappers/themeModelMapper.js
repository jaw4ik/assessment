import ThemeModel from 'models/theme';

export default {
    map: theme => new ThemeModel({
        id: theme.Id,
        name: theme.Name,
        settings: JSON.parse(theme.Settings),
        templateId: theme.TemplateId,
        createdBy: theme.CreatedBy,
        createdOn: new Date(theme.CreatedOn),
        modifiedOn: new Date(theme.ModifiedOn)
    })
};