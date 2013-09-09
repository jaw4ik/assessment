using System;
using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.DataAccess
{
    public class ExperienceRepository : IExperienceRepository
    {
        private readonly IDataContext _dataContext;

        public ExperienceRepository(IDataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public Experience Get(Guid id)
        {
            return _dataContext.Experiences.SingleOrDefault(experience => experience.Id == id);
        }

        public ICollection<Experience> GetCollection()
        {
            return _dataContext.Experiences;
        }

        public void Add(Experience entity)
        {
            _dataContext.Experiences.Add(entity);
        }

        public void Remove(Experience entity)
        {
            _dataContext.Experiences.Remove(entity);
        }
    }
}
