using easygenerator.DomainModel.Entities;
using System.Collections.Generic;

namespace easygenerator.DomainModel.Repositories
{
    public interface IObjectiveRepository : IRepository<Objective>
    {
        ICollection<Objective> GetAvailableObjectivesCollection(string username);
    }
}
