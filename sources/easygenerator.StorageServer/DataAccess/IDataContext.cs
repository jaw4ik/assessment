using easygenerator.StorageServer.Models.Entities;
using System.Data.Entity;

namespace easygenerator.StorageServer.DataAccess
{
    public interface IDataContext
    {
        IDbSet<T> GetSet<T>() where T : Entity;
    }
}