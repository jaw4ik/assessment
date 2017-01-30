using Autofac;
using easygenerator.DataAccess.Repositories;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Entities.Tickets;
using easygenerator.DomainModel.Entities.Users;
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

            builder.RegisterType<SectionRepository>()
                .As<ISectionRepository>()
                .As<IQuerableRepository<Section>>();

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

            builder.RegisterType<QuerableRepository<SurveyQuestion>>()
                .As<IQuerableRepository<SurveyQuestion>>();

            builder.RegisterType<QuerableRepository<TextMatchingAnswer>>()
               .As<IQuerableRepository<TextMatchingAnswer>>();

            builder.RegisterType<QuerableRepository<RankingText>>()
               .As<IQuerableRepository<RankingText>>();

            builder.RegisterType<QuerableRepository<RankingTextAnswer>>()
               .As<IQuerableRepository<RankingTextAnswer>>();

            builder.RegisterType<QuerableRepository<LearningContent>>()
                .As<IQuerableRepository<LearningContent>>();

            builder.RegisterType<UserRepository>()
                .As<IUserRepository>()
                .As<IQuerableRepository<User>>();

            builder.RegisterType<PasswordRecoveryTicketRepository>()
                .As<IPasswordRecoveryTicketRepository>()
                .As<IQuerableRepository<PasswordRecoveryTicket>>();

            builder.RegisterType<EmailConfirmationTicketRepository>()
                .As<IQuerableRepository<EmailConfirmationTicket>>();

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

            builder.RegisterType<IPLoginInfoRepository>()
                .As<IQuerableRepository<IPLoginInfo>>()
                .As<IIPLoginInfoRepository>();

            builder.RegisterType<UserLoginInfoRepository>()
                .As<IQuerableRepository<UserLoginInfo>>()
                .As<IUserLoginInfoRepository>();

            builder.RegisterType<SamlIdentityProviderRepository>()
                .As<IQuerableRepository<SamlIdentityProvider>>()
                .As<ISamlIdentityProviderRepository>();

            builder.RegisterType<SamlServiceProviderRepository>()
              .As<IQuerableRepository<SamlServiceProvider>>()
              .As<ISamlServiceProviderRepository>();

            builder.RegisterType<CompanyRepository>()
                .As<IQuerableRepository<Company>>()
                .As<ICompanyRepository>();

            builder.RegisterType<ThemeRepository>()
                .As<IQuerableRepository<Theme>>()
                .As<IThemeRepository>();

            builder.RegisterType<OrganizationRepository>()
               .As<IQuerableRepository<Organization>>()
               .As<IOrganizationRepository>();

            builder.RegisterType<OrganizationUserRepository>()
                .As<IQuerableRepository<OrganizationUser>>()
                .As<IOrganizationUserRepository>();

            builder.RegisterType<UserDomainRepository>()
                .As<IUserDomainRepository>();

            base.Load(builder);
        }
    }
}
