using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.DataAccess
{
    public class LearningObjectRepository : IQuerableRepository<LearningObject>
    {
        private readonly IDataContext _dataContext;

        public LearningObjectRepository(IDataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public ICollection<LearningObject> GetCollection()
        {
            var learningObjects = new List<LearningObject>();
            foreach (var question in _dataContext.Objectives.SelectMany(objective => objective.Questions))
            {
                learningObjects.AddRange(question.LearningObjects);
            }
            return new Collection<LearningObject>(learningObjects);
        }

        public LearningObject Get(Guid id)
        {
            return GetCollection().SingleOrDefault(learningObject => learningObject.Id == id);
        }
    }
}
