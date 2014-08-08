using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using System;

namespace easygenerator.DomainModel
{
    public interface IEntityFactory
    {
        Objective Objective(string title, string createdBy);
        Course Course(string title, Template template, string createdBy);
        SingleSelectText SingleSelectTextQuestion(string title, string createdBy);
        SingleSelectImage SingleSelectImageQuestion(string title, string createdBy);
        Multipleselect MultipleselectQuestion(string title, string createdBy);
        FillInTheBlanks FillInTheBlanksQuestion(string title, string createdBy);
        BlankAnswer BlankAnswer(string text, bool isCorrect, Guid groupId, string createdBy);
        DragAndDropText DragAndDropTextQuestion(string title, string createdBy);
        Dropspot Dropspot(string text, int x, int y, string createdBy);
        TextMatching TextMatchingQuestion(string title, string createdBy);
        TextMatchingAnswer TextMatchingAnswer(string key, string value, string createdBy);
        TextMatchingAnswer TextMatchingAnswer(string key, string value, string createdBy, DateTime createdOn);
        Comment Comment(string text, string createdBy);
        SingleSelectImageAnswer SingleSelectImageAnswer(string image, string createdBy);
        SingleSelectImageAnswer SingleSelectImageAnswer(string createdBy, DateTime createdOn);
        Answer Answer(string text, bool isCorrect, string createdBy);
        Answer Answer(string text, bool isCorrect, string createdBy, DateTime createdOn);
        LearningContent LearningContent(string text, string createdBy);
        User User(string email, string password, string firstname, string lastname, string phone, string organization, string country, string createdBy);
        PasswordRecoveryTicket PasswordRecoveryTicket(User user);
        ImageFile ImageFile(string title, string createdBy);
        InformationContent InformationContent(string title, string createdBy);
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

        public SingleSelectText SingleSelectTextQuestion(string title, string createdBy)
        {
            return new SingleSelectText(title, createdBy);
        }

        public SingleSelectImage SingleSelectImageQuestion(string title, string createdBy)
        {
            return new SingleSelectImage(title, createdBy);
        }

        public Multipleselect MultipleselectQuestion(string title, string createdBy)
        {
            return new Multipleselect(title, createdBy);
        }

        public FillInTheBlanks FillInTheBlanksQuestion(string title, string createdBy)
        {
            return new FillInTheBlanks(title, createdBy);
        }

        public BlankAnswer BlankAnswer(string text, bool isCorrect, Guid groupId, string createdBy)
        {
            return new BlankAnswer(text, isCorrect, groupId, createdBy);
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

        public Answer Answer(string text, bool isCorrect, string createdBy)
        {
            return new Answer(text, isCorrect, createdBy);
        }

        public Answer Answer(string text, bool isCorrect, string createdBy, DateTime createdOn)
        {
            return new Answer(text, isCorrect, createdBy, createdOn);
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

        public SingleSelectImageAnswer SingleSelectImageAnswer(string image, string createdBy)
        {
            return new SingleSelectImageAnswer(image, createdBy);
        }

        public SingleSelectImageAnswer SingleSelectImageAnswer(string createdBy, DateTime createdOn)
        {
            return new SingleSelectImageAnswer(createdBy, createdOn);
        }

        public TextMatching TextMatchingQuestion(string title, string createdBy)
        {
            return new TextMatching(title, createdBy);
        }

        public TextMatchingAnswer TextMatchingAnswer(string key, string value, string createdBy)
        {
            return new TextMatchingAnswer(key, value, createdBy);
        }

        public TextMatchingAnswer TextMatchingAnswer(string key, string value, string createdBy, DateTime createdOn)
        {
            return new TextMatchingAnswer(key, value, createdBy, createdOn);
        }

        public InformationContent InformationContent(string title, string createdBy)
        {
            return new InformationContent(title, createdBy);
        }
    }
}
