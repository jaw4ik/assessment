using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Users;
using easygenerator.Infrastructure.DomainModel;

namespace easygenerator.DomainModel.Repositories
{
    public interface IUserDomainRepository
    {
        UserDomain Get(string domain);
        void Add(UserDomain entity);
        void Remove(UserDomain entity);
    }
}
