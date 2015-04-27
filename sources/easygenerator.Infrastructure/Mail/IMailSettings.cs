using System.Collections.Generic;

namespace easygenerator.Infrastructure.Mail
{
    public interface IMailSettings
    {
        Dictionary<string, IMailTemplate> MailTemplatesSettings { get; }
    }
}
