using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel
{
    public interface IEntityFactory
    {
        Objective Objective(string title, string createdBy);
        Experience Experience(string title, Template template, string createdBy);
        Question Question(string title, string createdBy);
        Answer Answer(string text, bool isCorrect, string createdBy);
        LearningObject LearningObject(string text, string createdBy);
        User User(string email, string password, string createdBy);
        HelpHint HelpHint(string name, string createdBy);
        MailNotification MailNotification(string body, string subject, string from, string to, string cc = null,string bcc = null);
        PasswordRecoveryTicket PasswordRecoveryTicket(User user);

    }

    public class EntityFactory : IEntityFactory
    {
        public Objective Objective(string title, string createdBy)
        {
            return new Objective(title, createdBy);
        }

        public Experience Experience(string title, Template template, string createdBy)
        {
            return new Experience(title, template, createdBy);
        }

        public Question Question(string title, string createdBy)
        {
            return new Question(title, createdBy);
        }

        public Answer Answer(string text, bool isCorrect, string createdBy)
        {
            return new Answer(text, isCorrect, createdBy);
        }

        public LearningObject LearningObject(string text, string createdBy)
        {
            return new LearningObject(text, createdBy);
        }

        public User User(string email, string password, string createdBy)
        {
            return new User(email, password, createdBy);
        }

        public HelpHint HelpHint(string name, string createdBy)
        {
            return new HelpHint(name, createdBy);
        }

        public MailNotification MailNotification(string body, string subject, string from, string to, string cc = null, string bcc = null)
        {
            return new MailNotification(body, subject, from, to, cc, bcc);
        }

        public PasswordRecoveryTicket PasswordRecoveryTicket(User user)
        {
            return new PasswordRecoveryTicket();
        }
    }
}
