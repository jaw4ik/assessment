using System;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel
{
    public interface IEntityFactory
    {
        Objective Objective(string title, string createdBy);
        Course Course(string title, Template template, string createdBy);
        Multiplechoice MultiplechoiceQuestion(string title, string createdBy);
        Multipleselect MultipleselectQuestion(string title, string createdBy);
        FillInTheBlanks FillInTheBlanksQuestion(string title, string createdBy);
        DragAndDropText DragAndDropTextQuestion(string title, string createdBy);
        Dropspot Dropspot(string text, int x, int y, string createdBy);
        Comment Comment(string text, string createdBy);
        Answer Answer(string text, bool isCorrect, Guid group, string createdBy);
        Answer Answer(string text, bool isCorrect, Guid group, string createdBy, DateTime createdOn);
        LearningContent LearningContent(string text, string createdBy);
        User User(string email, string password, string firstname, string lastname, string phone, string organization, string country, string createdBy);
        PasswordRecoveryTicket PasswordRecoveryTicket(User user);
        ImageFile ImageFile(string title, string createdBy);
    }

    public class EntityFactory : IEntityFactory
    {
        public Objective Objective(string title, string createdBy)
        {
            return new Objective(title, createdBy);
        }

        public Course Course(string title, Template template, string createdBy)
        {
            return new Course(title, template, createdBy);
        }

        public Multiplechoice MultiplechoiceQuestion(string title, string createdBy)
        {
            return new Multiplechoice(title, createdBy);
        }

        public Multipleselect MultipleselectQuestion(string title, string createdBy)
        {
            return new Multipleselect(title, createdBy);
        }

        public FillInTheBlanks FillInTheBlanksQuestion(string title, string createdBy)
        {
            return new FillInTheBlanks(title, createdBy);
        }

        public DragAndDropText DragAndDropTextQuestion(string title, string createdBy)
        {
            return new DragAndDropText(title, createdBy);
        }

        public Dropspot Dropspot(string text, int x, int y, string createdBy)
        {
            return new Dropspot(text, x, y, createdBy);
        }

        public Comment Comment(string text, string createdBy)
        {
            return new Comment(createdBy, text);
        }

        public Answer Answer(string text, bool isCorrect, Guid group, string createdBy)
        {
            return new Answer(text, isCorrect, group, createdBy);
        }

        public Answer Answer(string text, bool isCorrect, Guid group, string createdBy, DateTime createdOn)
        {
            return new Answer(text, isCorrect, group, createdBy, createdOn);
        }

        public LearningContent LearningContent(string text, string createdBy)
        {
            return new LearningContent(text, createdBy);
        }

        public User User(string email, string password, string firstname, string lastname, string phone, string organization, string country, string createdBy)
        {
            return new User(email, password, firstname, lastname, phone, organization, country, createdBy);
        }

        public PasswordRecoveryTicket PasswordRecoveryTicket(User user)
        {
            return new PasswordRecoveryTicket();
        }

        public ImageFile ImageFile(string title, string createdBy)
        {
            return new ImageFile(title, createdBy);
        }
    }
}
