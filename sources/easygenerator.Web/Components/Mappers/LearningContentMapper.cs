using easygenerator.DomainModel.Entities;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class LearningContentMapper : EntityModelMapper<LearningContent>
    {
        public override dynamic Map(LearningContent entity)
        {
            return new
            {
                Id = entity.Id.ToNString(),
                Text = entity.Text,
                CreatedOn = entity.CreatedOn,
                CreatedBy = entity.CreatedBy,
                ModifiedOn = entity.ModifiedOn,
                Position = entity.Position
            };
        }
    }
}