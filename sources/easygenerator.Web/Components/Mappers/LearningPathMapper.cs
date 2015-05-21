using easygenerator.DomainModel.Entities;
using easygenerator.Web.Extensions;

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
                CreatedOn = entity.CreatedOn,
                CreatedBy = entity.CreatedBy,
                ModifiedOn = entity.ModifiedOn
            };
        }
    }
}