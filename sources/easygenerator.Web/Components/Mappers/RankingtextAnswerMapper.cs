using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class RankingtextAnswerMapper : EntityModelMapper<RankingTextAnswer>
    {
        public override dynamic Map(RankingTextAnswer entity)
        {
            return new
            {
                Id = entity.Id.ToNString(),
                Text = entity.Text,
                CreatedOn = entity.CreatedOn,
                CreatedBy = entity.CreatedBy,
                ModifiedOn = entity.ModifiedOn
            };
        }
    }
}