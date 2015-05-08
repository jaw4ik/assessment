using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.Infrastructure.Mail
{
    public interface IMailTemplate
    {
        string Name { get; set; }
        string From { get; set; }
        string To { get; set; }
        string Subject { get; set; }
        string Cc { get; set; }
        string Bcc { get; set; }
        string ViewPath { get; set; }
    }
}
