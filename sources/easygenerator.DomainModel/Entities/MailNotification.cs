using easygenerator.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.DomainModel.Entities
{
    public class MailNotification : Entity
    {
        public string Subject { get; private set; }
        public string ToEmailAddresses { get; private set; }
        public string CCEmailAddresses { get; private set; }
        public string BCCEmailAddresses { get; private set; }
        public string FromEmailAddress { get; private set; }
        public string Body { get; private set; }

        protected internal MailNotification() {}

        protected internal MailNotification(string body, string subject, string fromEmailAddress, string toEmailAddresses)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(body, "body");
            ArgumentValidation.ThrowIfNullOrEmpty(subject, "subject");
            ArgumentValidation.ThrowIfNullOrEmpty(fromEmailAddress, "fromEmailAddress");
            ArgumentValidation.ThrowIfNullOrEmpty(toEmailAddresses, "toEmailAddresses");

            Body = body;
            Subject = subject;
            ToEmailAddresses = toEmailAddresses;
            FromEmailAddress = fromEmailAddress;
        }

        protected internal MailNotification(string body, string subject, string fromEmailAddress, string toEmailAddresses, string ccEmailAddresses)
            : this(body, subject, fromEmailAddress, toEmailAddresses)
        {
            CCEmailAddresses = ccEmailAddresses;
        }

        protected internal MailNotification(string body, string subject, string fromEmailAddress, string toEmailAddresses, string ccEmailAddresses, string bccEmailAddresses)
            : this(body, subject, fromEmailAddress, toEmailAddresses, ccEmailAddresses)
        {
            BCCEmailAddresses = bccEmailAddresses;
        }
    }
}
