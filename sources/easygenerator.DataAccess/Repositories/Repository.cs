using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.DataAccess.Repositories
{
    public class Repository<T> : QuerableRepository<T>, IRepository<T> where T : Identifiable
    {
        public Repository(IDataContext dataContext)
            : base(dataContext)
        {
        }

        public void Add(T entity)
        {
            _dataContext.GetSet<T>().Add(entity);
        }

        public void Remove(T entity)
        {
            _dataContext.GetSet<T>().Remove(entity);
        }
    }
}
