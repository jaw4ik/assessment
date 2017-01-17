using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Repositories
{
    public interface IIPLoginInfoRepository : IRepository<IPLoginInfo>
    {
        IPLoginInfo GetByIP(string ip);
    }
}
