using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class ObjectiveEntityModelMapper : IEntityModelMapper<Objective>
    {
        private readonly IEntityModelMapper<Question> _questionEntityModelMapper;

        public ObjectiveEntityModelMapper(IEntityModelMapper<Question> questionEntityModelMapper)
        {
            _questionEntityModelMapper = questionEntityModelMapper;
        }

        public dynamic Map(Objective obj)
        {
            return new
            {
                Id = obj.Id.ToNString(),
                Title = obj.Title,
                CreatedBy = obj.CreatedBy,
                CreatedOn = obj.CreatedOn,
                ModifiedOn = obj.ModifiedOn,
                Questions = obj.Questions.Select(q => _questionEntityModelMapper.Map(q))
            };
        }
    }
}