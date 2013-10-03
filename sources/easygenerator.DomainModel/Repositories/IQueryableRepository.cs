using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Repositories
{
    public interface IQuerableRepository<T> where T : Entity
    {
        T Get(Guid id);

        ICollection<T> GetCollection();
    }
}
