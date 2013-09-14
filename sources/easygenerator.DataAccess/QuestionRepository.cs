using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.DataAccess
{
    public class QuestionRepository : IRepository<Question>
    {
        private readonly IDataContext _dataContext;

        public QuestionRepository(IDataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public ICollection<Question> GetCollection()
        {
            var questions = new List<Question>();
            foreach (var objective in _dataContext.Objectives)
            {
                questions.AddRange(objective.Questions);
            }
            return new Collection<Question>(questions);
        }

        public void Add(Question entity)
        {
            throw new NotImplementedException();
        }

        public void Remove(Question entity)
        {
            throw new NotImplementedException();
        }

        public Question Get(Guid id)
        {
            return GetCollection().SingleOrDefault(question => question.Id == id);
        }
    }
}
