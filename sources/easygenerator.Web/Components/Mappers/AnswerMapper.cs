using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class AnswerMapper : EntityModelMapper<Answer>
    {
        public override dynamic Map(Answer answer)
        {
            return new
            {
                Id = answer.Id.ToNString(),
                Text = answer.Text,
                IsCorrect = answer.IsCorrect,
                CreatedOn = answer.CreatedOn,
            };
        }
    }
}