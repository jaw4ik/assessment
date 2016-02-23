using Autofac;
using easygenerator.DataAccess.Repositories;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Http;
using easygenerator.Infrastructure.Mail;

namespace easygenerator.DataAccess
{
    public class DataAccessModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<DatabaseContext>()
                .As<IDataContext>()
                .As<IUnitOfWork>()
                .InstancePerLifetimeScope();

            builder.RegisterType<ObjectiveRepository>()
                .As<IObjectiveRepository>()
                .As<IQuerableRepository<Objective>>();

            builder.RegisterType<CourseRepository>()
                .As<ICourseRepository>()
                .As<IQuerableRepository<Course>>();

            builder.RegisterType<DocumentRepository>()
                .As<IDocumentRepository>()
                .As<IQuerableRepository<Document>>();

            builder.RegisterType<TemplateRepository>()
                .As<ITemplateRepository>()
                .As<IQuerableRepository<Template>>();

            builder.RegisterType<QuerableRepository<Question>>()
                .As<IQuerableRepository<Question>>();

            builder.RegisterType<QuerableRepository<Comment>>()
                .As<IQuerableRepository<Comment>>();

            builder.RegisterType<QuerableRepository<SingleSelectText>>()
                .As<IQuerableRepository<SingleSelectText>>();

            builder.RegisterType<QuerableRepository<SingleSelectImage>>()
              .As<IQuerableRepository<SingleSelectImage>>();

            builder.RegisterType<QuerableRepository<SingleSelectImageAnswer>>()
              .As<IQuerableRepository<SingleSelectImageAnswer>>();

            builder.RegisterType<QuerableRepository<Multipleselect>>()
                .As<IQuerableRepository<Multipleselect>>();

            builder.RegisterType<QuerableRepository<FillInTheBlanks>>()
                .As<IQuerableRepository<FillInTheBlanks>>();

            builder.RegisterType<QuerableRepository<BlankAnswer>>()
                .As<IQuerableRepository<BlankAnswer>>();

            builder.RegisterType<QuerableRepository<DragAndDropText>>()
                .As<IQuerableRepository<DragAndDropText>>();

            builder.RegisterType<QuerableRepository<HotSpot>>()
                .As<IQuerableRepository<HotSpot>>();

            builder.RegisterType<QuerableRepository<Answer>>()
                .As<IQuerableRepository<Answer>>();

            builder.RegisterType<QuerableRepository<Dropspot>>()
                .As<IQuerableRepository<Dropspot>>();

            builder.RegisterType<QuerableRepository<HotSpotPolygon>>()
                .As<IQuerableRepository<HotSpotPolygon>>();

            builder.RegisterType<QuerableRepository<TextMatching>>()
                .As<IQuerableRepository<TextMatching>>();

            builder.RegisterType<QuerableRepository<Scenario>>()
                .As<IQuerableRepository<Scenario>>();

            builder.RegisterType<QuerableRepository<TextMatchingAnswer>>()
               .As<IQuerableRepository<TextMatchingAnswer>>();

            builder.RegisterType<QuerableRepository<LearningContent>>()
                .As<IQuerableRepository<LearningContent>>();

            builder.RegisterType<UserRepository>()
                .As<IUserRepository>()
                .As<IQuerableRepository<User>>();

            builder.RegisterType<PasswordRecoveryTicketRepository>()
                .As<IPasswordRecoveryTicketRepository>()
                .As<IQuerableRepository<PasswordRecoveryTicket>>();

            builder.RegisterType<MailNotificationRepository>()
                .As<IMailNotificationRepository>();

            builder.RegisterType<ImageFileRepository>()
                .As<IImageFileRepository>()
                .As<IQuerableRepository<ImageFile>>();

            builder.RegisterType<HttpRequestsRepository>()
                .As<IHttpRequestsRepository>();

            builder.RegisterType<CourseCollaboratorRepository>()
                .As<IQuerableRepository<CourseCollaborator>>()
                .As<ICourseCollaboratorRepository>();

            builder.RegisterType<OnboardingRepository>()
                .As<IQuerableRepository<Onboarding>>()
                .As<IOnboardingRepository>();

            builder.RegisterType<DemoCourseInfoRepository>()
                .As<IQuerableRepository<DemoCourseInfo>>()
                .As<IDemoCourseInfoRepository>();

            builder.RegisterType<CourseStateRepository>()
                .As<IQuerableRepository<CourseState>>()
                .As<ICourseStateRepository>();

            builder.RegisterType<LearningPathRepository>()
                .As<IQuerableRepository<LearningPath>>()
                .As<ILearningPathRepository>();

            builder.RegisterType<ConsumerToolRepository>()
                .As<IQuerableRepository<ConsumerTool>>()
                .As<IConsumerToolRepository>();

            builder.RegisterType<CompanyRepository>()
                .As<IQuerableRepository<Company>>()
                .As<ICompanyRepository>();

            base.Load(builder);
        }
    }
}
