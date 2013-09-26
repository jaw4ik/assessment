using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel
{
    public interface IEntityFactory
    {
        Objective Objective(string title);
        Experience Experience(string title, Template template);
        Question Question(string title);
        Answer Answer(string text, bool isCorrect);
        Explanation Explanation(string text);
    }

    public class EntityFactory : IEntityFactory
    {
        public Objective Objective(string title)
        {
            return new Objective(title);
        }

        public Experience Experience(string title, Template template)
        {
            return new Experience(title, template);
        }

        public Question Question(string title)
        {
            return new Question(title);
        }

        public Answer Answer(string text, bool isCorrect)
        {
            return new Answer(text, isCorrect);
        }

        public Explanation Explanation(string text)
        {
            return new Explanation(text);
        }
    }
}
