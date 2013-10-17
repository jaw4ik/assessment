using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.Web.Mail
{
    internal static class MailTemplatesProvider
    {
        private static readonly Dictionary<string, string> _mailTemplatesCache = new Dictionary<string, string>();
        private static readonly object _locker = new object();

        internal static string GetMailTemplate(string templatePath)
        {
            if (_mailTemplatesCache.ContainsKey(templatePath))
            {
                return _mailTemplatesCache[templatePath];
            }

            lock (_locker)
            {
                if (!_mailTemplatesCache.ContainsKey(templatePath))
                {
                    string content = File.ReadAllText(templatePath);
                    _mailTemplatesCache[templatePath] = content;
                }
                return _mailTemplatesCache[templatePath];
            }
        }
    }
}
