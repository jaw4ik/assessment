using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Entities.Tickets;
using System;
using System.Collections.Generic;

namespace easygenerator.DomainModel
{
    public interface IEntityFactory
    {
        Section Section(string title, string createdBy);
        Document Document(string title, string embedCode, DocumentType documentType, string createdBy);
        Course Course(string title, Template template, string createdBy);
        SingleSelectText SingleSelectTextQuestion(string title, string createdBy);
        SingleSelectText SingleSelectTextQuestion(string title, string createdBy, bool isSurvey, Answer correctAnswer, Answer incorrectAnswer);
        SingleSelectImage SingleSelectImageQuestion(string title, string createdBy);
        SingleSelectImage SingleSelectImageQuestion(string title, string createdBy, SingleSelectImageAnswer correctAnswer, SingleSelectImageAnswer incorrectAnswer);
        Multipleselect MultipleselectQuestion(string title, string createdBy);
        Multipleselect MultipleselectQuestion(string title, string createdBy, bool isSurvey, Answer correctAnswer, Answer incorrectAnswer);

        Statement StatementQuestion(string title, string createdBy);
        Statement StatementQuestion(string title, string defaultStatementText, bool isSurvey, string createdBy);

        FillInTheBlanks FillInTheBlanksQuestion(string title, string createdBy);
        BlankAnswer BlankAnswer(string text, bool isCorrect, bool matchCase, Guid groupId, string createdBy);
        RankingText RankingTextQuestion(string title, string createdBy);

        RankingText RankingTextQuestion(string title, string createdBy, RankingTextAnswer firstAnswer, RankingTextAnswer secondAnswer);
        RankingTextAnswer RankingTextAnswer(string text, string createdBy);
        RankingTextAnswer RankingTextAnswer(string text, string createdBy, DateTime createdOn);
        DragAndDropText DragAndDropTextQuestion(string title, string createdBy);
        Dropspot Dropspot(string text, int x, int y, string createdBy);
        TextMatching TextMatchingQuestion(string title, string createdBy);
        TextMatching TextMatchingQuestion(string title, string createdBy, TextMatchingAnswer questionAnswer1, TextMatchingAnswer questionAnswer2);
        TextMatchingAnswer TextMatchingAnswer(string key, string value, string createdBy);
        TextMatchingAnswer TextMatchingAnswer(string key, string value, string createdBy, DateTime createdOn);
        Comment Comment(string text, string createdByName, string createdBy, string context);
        Comment Comment(string text, string createdByName, string createdBy, string context, DateTime createdOn);
        SingleSelectImageAnswer SingleSelectImageAnswer(string image, string createdBy);
        SingleSelectImageAnswer SingleSelectImageAnswer(string createdBy, DateTime createdOn);
        HotSpot HotSpot(string title, string createdBy);
        HotSpotPolygon HotSpotPolygon(string points, string createdBy);
        Answer Answer(string text, bool isCorrect, string createdBy);
        Answer Answer(string text, bool isCorrect, string createdBy, DateTime createdOn);
        LearningContent LearningContent(string text, string createdBy);
        User User(string email, string password, string firstname, string lastname, string phone, string country, string role, string createdBy, string lastReadReleaseNote);
        User User(string email, string password, string firstname, string lastname, string phone, string country,
            string role, string createdBy, AccessType accessPlan, string lastReadReleaseNote, DateTime expirationDate, bool isCreatedThroughLti, bool isCreatedThroughSamlIdP,
            ICollection<Company> companies, ICollection<SamlServiceProvider> allowedSamlSPs, bool? newEditor = true, bool isNewEditorByDefault = true);
        LtiUserInfo LtiUserInfo(string ltiUserId, ConsumerTool consumerTool, User user);
        PasswordRecoveryTicket PasswordRecoveryTicket();
        EmailConfirmationTicket EmailConfirmationTicket();
        SamlIdPUserInfo SamlIdPUserInfo(SamlIdentityProvider samlIdP, User user);
        ImageFile ImageFile(string title, string createdBy);
        InformationContent InformationContent(string title, string createdBy);
        OpenQuestion OpenQuestion(string title, string createdBy);
        Onboarding Onboarding(string userEmail);
        DemoCourseInfo DemoCourseInfo(Course sourceCourse, Course demoCourse, string createdBy);
        CourseState CourseState(Course course, bool isDirty, bool isDirtyForSale);
        LearningPath LearningPath(string title, string createdBy);
        Scenario Scenario(string title, int masteryScore, string createdBy);
        Organization Organization(string title, string createdBy);
        Theme Theme(Template template, string name, string settings, string createdBy);
    }

    public class EntityFactory : IEntityFactory
    {
        public Section Section(string title, string createdBy)
        {
            return new Section(title, createdBy);
        }

        public Document Document(string title, string embedCode, DocumentType documentType, string createdBy)
        {
            return new Document(title, embedCode, documentType, createdBy);
        }

        public Course Course(string title, Template template, string createdBy)
        {
            return new Course(title, template, createdBy);
        }

        public SingleSelectText SingleSelectTextQuestion(string title, string createdBy)
        {
            return new SingleSelectText(title, createdBy);
        }

        public SingleSelectText SingleSelectTextQuestion(string title, string createdBy, bool isSurvey, Answer correctAnswer, Answer incorrectAnswer)
        {
            return new SingleSelectText(title, createdBy, isSurvey, correctAnswer, incorrectAnswer);
        }

        public SingleSelectImage SingleSelectImageQuestion(string title, string createdBy)
        {
            return new SingleSelectImage(title, createdBy);
        }

        public SingleSelectImage SingleSelectImageQuestion(string title, string createdBy, SingleSelectImageAnswer correctAnswer, SingleSelectImageAnswer incorrectAnswer)
        {
            return new SingleSelectImage(title, createdBy, correctAnswer, incorrectAnswer);
        }

        public Multipleselect MultipleselectQuestion(string title, string createdBy)
        {
            return new Multipleselect(title, createdBy);
        }

        public Multipleselect MultipleselectQuestion(string title, string createdBy, bool isSurvey, Answer correctAnswer, Answer incorrectAnswer)
        {
            return new Multipleselect(title, createdBy, isSurvey, correctAnswer, incorrectAnswer);
        }

        public Statement StatementQuestion(string title, string createdBy)
        {
            return new Statement(title, createdBy);
        }

        public Statement StatementQuestion(string title, string defaultStatementText, bool isSurvey, string createdBy)
        {
            return new Statement(title, defaultStatementText, isSurvey, createdBy);
        }

        public FillInTheBlanks FillInTheBlanksQuestion(string title, string createdBy)
        {
            return new FillInTheBlanks(title, createdBy);
        }

        public BlankAnswer BlankAnswer(string text, bool isCorrect, bool matchCase, Guid groupId, string createdBy)
        {
            return new BlankAnswer(text, isCorrect, matchCase, groupId, createdBy);
        }

        public DragAndDropText DragAndDropTextQuestion(string title, string createdBy)
        {
            return new DragAndDropText(title, createdBy);
        }

        public Dropspot Dropspot(string text, int x, int y, string createdBy)
        {
            return new Dropspot(text, x, y, createdBy);
        }

        public Comment Comment(string text, string createdByName, string createdBy, string context)
        {
            return new Comment(createdByName, createdBy, text, context);
        }

        public Comment Comment(string text, string createdByName, string createdBy, string context, DateTime createdOn)
        {
            return new Comment(createdByName, createdBy, text, context, createdOn);
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

        public User User(string email, string password, string firstname, string lastname, string phone, string country, string role, string createdBy, string lastReadReleaseNote)
        {
            return new User(email, password, firstname, lastname, phone, country, role, createdBy, AccessType.Trial, lastReadReleaseNote);
        }

        public User User(string email, string password, string firstname, string lastname, string phone, string country, string role, string createdBy, AccessType accessPlan, string lastReadReleaseNote, DateTime expirationDate, bool isCreatedThroughLti, bool isCreatedThroughSamlIdP, ICollection<Company> companies, ICollection<SamlServiceProvider> allowedSamlSPs, bool? newEditor, bool isNewEditorByDefault = true)
        {
            return new User(email, password, firstname, lastname, phone, country, role, createdBy, accessPlan, lastReadReleaseNote, expirationDate, isCreatedThroughLti, isCreatedThroughSamlIdP, companies, allowedSamlSPs, false, newEditor);
        }

        public LtiUserInfo LtiUserInfo(string ltiUserId, ConsumerTool consumerTool, User user)
        {
            return new LtiUserInfo(ltiUserId, consumerTool, user);
        }

        public PasswordRecoveryTicket PasswordRecoveryTicket()
        {
            return new PasswordRecoveryTicket();
        }

        public EmailConfirmationTicket EmailConfirmationTicket()
        {
            return new EmailConfirmationTicket();
        }

        public SamlIdPUserInfo SamlIdPUserInfo(SamlIdentityProvider samlIdP, User user)
        {
            return new SamlIdPUserInfo(samlIdP, user);
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


        public HotSpot HotSpot(string title, string createdBy)
        {
            return new HotSpot(title, createdBy);

        }

        public HotSpotPolygon HotSpotPolygon(string points, string createdBy)
        {
            return new HotSpotPolygon(points, createdBy);
        }

        public TextMatching TextMatchingQuestion(string title, string createdBy)
        {
            return new TextMatching(title, createdBy);
        }

        public TextMatching TextMatchingQuestion(string title, string createdBy, TextMatchingAnswer questionAnswer1, TextMatchingAnswer questionAnswer2)
        {
            return new TextMatching(title, createdBy, questionAnswer1, questionAnswer2);
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

        public OpenQuestion OpenQuestion(string title, string createdBy)
        {
            return new OpenQuestion(title, createdBy);
        }

        public Onboarding Onboarding(string userEmail)
        {
            return new Onboarding(userEmail);
        }

        public DemoCourseInfo DemoCourseInfo(Course sourceCourse, Course demoCourse, string createdBy)
        {
            return new DemoCourseInfo(sourceCourse, demoCourse, createdBy);
        }

        public CourseState CourseState(Course course, bool isDirty, bool isDirtyForSale)
        {
            return new CourseState(course, isDirty, isDirtyForSale);
        }

        public LearningPath LearningPath(string title, string createdBy)
        {
            return new LearningPath(title, createdBy);
        }

        public Scenario Scenario(string title, int masteryScore, string createdBy)
        {
            return new Scenario(title, masteryScore, createdBy);
        }

        public Organization Organization(string title, string createdBy)
        {
            return new Organization(title, createdBy);
        }

        public RankingText RankingTextQuestion(string title, string createdBy)
        {
            return new RankingText(title, createdBy);
        }

        public RankingText RankingTextQuestion(string title, string createdBy, RankingTextAnswer firstAnswer,
            RankingTextAnswer secondAnswer)
        {
            return new RankingText(title, createdBy, firstAnswer, secondAnswer);
        }

        public RankingTextAnswer RankingTextAnswer(string text, string createdBy)
        {
            return new RankingTextAnswer(text, createdBy);
        }

        public RankingTextAnswer RankingTextAnswer(string text, string createdBy, DateTime createdOn)
        {
            return new RankingTextAnswer(text, createdBy, createdOn);
        }

        public Theme Theme(Template template, string name, string settings, string createdBy)
        {
            return new Theme(template, name, settings, createdBy);
        }
    }
}
