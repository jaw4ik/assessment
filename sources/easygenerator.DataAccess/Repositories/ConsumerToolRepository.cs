using System.Data.Entity;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.DataAccess.Repositories
{
    public class ConsumerToolRepository : Repository<ConsumerTool>, IConsumerToolRepository
    {
        public ConsumerToolRepository(IDataContext dataContext)
            : base(dataContext)
        {
        }

        public ConsumerTool GetByKey(string key)
        {
            // first fetch all matched entries, then filter (if filter on DB side comparison will be NOT case sensitive)
            return _dataContext.GetSet<ConsumerTool>().Include(e => e.LtiUserInfoes).Where(tool => tool.Key == key).AsEnumerable()
                .FirstOrDefault(tool => tool.Key == key);
        }
    }
}
