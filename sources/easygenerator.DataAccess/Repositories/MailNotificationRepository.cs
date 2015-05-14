using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure.DomainModel;
using easygenerator.Infrastructure.Mail;
using System.Collections.Generic;
using System.Linq;

namespace easygenerator.DataAccess.Repositories
{
    public class MailNotificationRepository : IMailNotificationRepository
    {
        protected readonly DatabaseContext _dataContext;

        public MailNotificationRepository(IDataContext dataContext)
        {
            _dataContext = (DatabaseContext)dataContext;
        }

        public void Add(MailNotification entity)
        {
            _dataContext.Set<MailNotification>().Add(entity);
        }

        public void Remove(MailNotification entity)
        {
            _dataContext.Set<MailNotification>().Remove(entity);
        }

        public ICollection<MailNotification> GetCollection(int batchSize)
        {
            return _dataContext.Set<MailNotification>().OrderBy(_ => _.CreatedOn).Take(batchSize).ToList();
        }
    }
}
