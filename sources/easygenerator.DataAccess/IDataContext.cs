using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DataAccess
{
    public interface IDataContext
    {
        IDbSet<T> GetSet<T>() where T : Identifiable;
    }
}
