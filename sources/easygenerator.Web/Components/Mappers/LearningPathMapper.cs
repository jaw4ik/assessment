using easygenerator.DomainModel.Entities;
using easygenerator.Web.Extensions;
using System.Linq;

namespace easygenerator.Web.Components.Mappers
{
    public class LearningPathMapper : IEntityModelMapper<LearningPath>
    {
        public dynamic Map(LearningPath entity)
        {
            return new
            {
                Id = entity.Id.ToNString(),
                Title = entity.Title,
                PackageUrl = entity.PackageUrl,
                PublicationUrl = entity.PublicationUrl,
                CreatedOn = entity.CreatedOn,
                CreatedBy = entity.CreatedBy,
                ModifiedOn = entity.ModifiedOn,
                Courses = entity.Courses.Select(e => new
                {
                    Id = e.Id.ToNString()
                })
            };
        }
    }
}