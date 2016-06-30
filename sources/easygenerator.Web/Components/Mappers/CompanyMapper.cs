using easygenerator.DomainModel.Entities;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class CompanyMapper : EntityModelMapper<Company>
    {
        public override dynamic Map(Company entity)
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