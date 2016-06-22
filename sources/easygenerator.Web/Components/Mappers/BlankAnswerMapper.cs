using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class BlankAnswerMapper : EntityModelMapper<BlankAnswer>
    {
        public override dynamic Map(BlankAnswer answer)
        {
            return new
            {
                Id = answer.Id.ToNString(),
                Text = answer.Text,
                IsCorrect = answer.IsCorrect,
                MatchCase = answer.MatchCase,
                CreatedOn = answer.CreatedOn,
                GroupId = answer.GroupId.ToNString()
            };
        }
    }
}