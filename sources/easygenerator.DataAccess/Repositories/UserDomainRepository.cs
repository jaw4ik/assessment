using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Users;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure.DomainModel;

namespace easygenerator.DataAccess.Repositories
{
    public class UserDomainRepository: IUserDomainRepository
    {
        protected readonly DatabaseContext _dataContext;

        public UserDomainRepository(IDataContext dataContext)
        {
            _dataContext = (DatabaseContext)dataContext;
        }

        public void Add(UserDomain entity)
        {
            _dataContext.Set<UserDomain>().Add(entity);
        }

        public void Remove(UserDomain entity)
        {
            _dataContext.Set<UserDomain>().Remove(entity);
        }

        public UserDomain Get(string domain)
        {
            return _dataContext.Set<UserDomain>().SingleOrDefault(e => e.Domain == domain);
        }
    }
}
