using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class ThemeMapper : IEntityModelMapper<Theme>
    {
        public dynamic Map(Theme theme)
        {
            return new
            {
                Id = theme.Id.ToNString(),
                Name = theme.Name,
                Settings = theme.Settings,
                TemplateId = theme.Template.Id.ToNString(),
                CreatedBy = theme.CreatedBy,
                CreatedOn = theme.CreatedOn,
                ModifiedOn = theme.ModifiedOn
            };
        }

        public dynamic Map(Theme theme, string username)
        {
            return Map(theme);
        }
    }
}