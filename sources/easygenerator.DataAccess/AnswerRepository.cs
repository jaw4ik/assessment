using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.DataAccess
{
    public class AnswerRepository : IQuerableRepository<Answer>
    {
        private readonly IDataContext _dataContext;

        public AnswerRepository(IDataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public ICollection<Answer> GetCollection()
        {
            var answers = new List<Answer>();
            foreach (var question in _dataContext.Objectives.SelectMany(objective => objective.Questions))
            {
                answers.AddRange(question.Answers);
            }
            return new Collection<Answer>(answers);
        }

        public Answer Get(Guid id)
        {
            return GetCollection().SingleOrDefault(answer => answer.Id == id);
        }
    }
}
