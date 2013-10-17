using easygenerator.DomainModel.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.DomainModel.Repositories
{
    public interface IMailNotificationRepository
    {
        ICollection<MailNotification> GetCollection(int batchSize);
        void Add(MailNotification entity);
        void Remove(MailNotification entity);
    }
}
