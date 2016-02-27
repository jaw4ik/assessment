using easygenerator.DomainModel.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class CompanyMapper : IEntityModelMapper<Company>
    {
        public dynamic Map(Company entity)
        {
            if (entity == null)
            {
                return null;
            }

            return new
            {
                Id = entity.Id.ToNString(),
                Name = entity.Name,
                LogoUrl = entity.LogoUrl,
                PublishCourseApiUrl = entity.PublishCourseApiUrl,
                HideDefaultPublishOptions = entity.HideDefaultPublishOptions,
                Priority = entity.Priority,
                CreatedOn = entity.CreatedOn
            };
        }
    }
}