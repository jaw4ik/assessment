using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.DataAccess.Repositories
{
    public class MailNotificationRepository : Repository<MailNotification>, IMailNotificationRepository
    {
        public MailNotificationRepository(IDataContext dataContext)
            : base(dataContext)
        {
        }

        public ICollection<MailNotification> GetCollection(int batchSize)
        {
            return _dataContext.GetSet<MailNotification>().OrderBy(_ => _.CreatedOn).Take(batchSize).ToList();
        }
    }
}
