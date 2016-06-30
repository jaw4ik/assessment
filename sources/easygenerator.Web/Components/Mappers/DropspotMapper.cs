using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class DropspotMapper : EntityModelMapper<Dropspot>
    {
        public override dynamic Map(Dropspot entity)
        {
            return new
            {
                Id = entity.Id.ToNString(),
                Text = entity.Text,
                X = entity.X,
                Y = entity.Y,
                CreatedOn = entity.CreatedOn,
                CreatedBy = entity.CreatedBy,
                ModifiedOn = entity.ModifiedOn
            };
        }
    }
}