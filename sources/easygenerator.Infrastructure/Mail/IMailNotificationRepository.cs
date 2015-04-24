using System.Collections.Generic;
using easygenerator.Infrastructure.DomainModel;

namespace easygenerator.Infrastructure.Mail
{
    public interface IMailNotificationRepository
    {
        ICollection<MailNotification> GetCollection(int batchSize);
        void Add(MailNotification entity);
        void Remove(MailNotification entity);
    }
}
