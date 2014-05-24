using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class ObjectiveMapper : IEntityMapper<Objective>
    {
        private readonly IEntityMapper<Question> _questionMapper;

        public ObjectiveMapper(IEntityMapper<Question> questionMapper)
        {
            _questionMapper = questionMapper;
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
                Questions = obj.Questions.Select(q => _questionMapper.Map(q))
            };
        }
    }
}