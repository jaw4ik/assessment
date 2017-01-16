using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.DataAccess.Repositories
{
    public class IPLoginInfoRepository : Repository<IPLoginInfo>, IIPLoginInfoRepository
    {
        public IPLoginInfoRepository(IDataContext dataContext)
            : base(dataContext)
        {
        }

        public IPLoginInfo GetByIP(string ip)
        {
            return _dataContext.GetSet<IPLoginInfo>().FirstOrDefault(info => info.IP == ip);
        }
    }
}
