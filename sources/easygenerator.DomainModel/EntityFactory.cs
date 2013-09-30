using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel
{
    public interface IEntityFactory
    {
        Objective Objective(string title, string createdBy);
        Experience Experience(string title, Template template, string createdBy);
        Question Question(string title, string createdBy);
        Answer Answer(string text, bool isCorrect, string createdBy);
        Explanation Explanation(string text, string createdBy);
        User User(string email, string password, string createdBy);
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

        public Explanation Explanation(string text, string createdBy)
        {
            return new Explanation(text, createdBy);
        }

        public User User(string email, string password, string createdBy)
        {
            return new User(email, password, createdBy);
        }
    }
}
