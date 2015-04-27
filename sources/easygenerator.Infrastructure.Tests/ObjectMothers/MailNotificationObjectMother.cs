using easygenerator.Infrastructure.DomainModel;

namespace easygenerator.Infrastructure.Tests.ObjectMothers
{
    public class MailNotificationObjectMother
    {
        private const string Body = "test body mail";
        private const string Subject = "test mail subject";
        private const string FromEmailAddress = "easygenerator@easygenerator.com";
        private const string ToEmailAddresses = "easygenerator@easygenerator.com";
        private const string CCEmailAddresses = "easygenerator@easygenerator.com;easygenerator2@easygenerator.com";
        private const string BCCEmailAddresses = "easygenerator@easygenerator.com;easygenerator2@easygenerator.com";

        public static MailNotification Create(string body = Body, string subject = Subject, string from = FromEmailAddress, string to = ToEmailAddresses, string cc = CCEmailAddresses, string bcc = BCCEmailAddresses)
        {
            return new MailNotification(body, subject, from, to, cc, bcc);
        }

        public static MailNotification CreateWithBody(string body)
        {
            return Create(body: body);
        }

        public static MailNotification CreateWithSubject(string subject)
        {
            return Create(subject: subject);
        }

        public static MailNotification CreateWithFromAddress(string from)
        {
            return Create(from: from);
        }

        public static MailNotification CreateWithToAddresses(string to)
        {
            return Create(to: to);
        }
    }
}
