using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.Infrastructure.Mail
{
    public interface IMailNotificationManager
    {
        void AddMailNotificationToQueue(string templateName, dynamic templateModel, string fromAddress = null);
    }
}
