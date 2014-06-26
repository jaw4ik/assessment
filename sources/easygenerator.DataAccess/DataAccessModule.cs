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

            builder.RegisterType<TemplateRepository>()
                .As<ITemplateRepository>()
                .As<IQuerableRepository<Template>>();

            builder.RegisterType<QuerableRepository<Question>>()
                .As<IQuerableRepository<Question>>();

            builder.RegisterType<QuerableRepository<Multiplechoice>>()
                .As<IQuerableRepository<Multiplechoice>>();

            builder.RegisterType<QuerableRepository<Multipleselect>>()
                .As<IQuerableRepository<Multipleselect>>();

            builder.RegisterType<QuerableRepository<FillInTheBlanks>>()
                .As<IQuerableRepository<FillInTheBlanks>>();

            builder.RegisterType<QuerableRepository<DragAndDropText>>()
                .As<IQuerableRepository<DragAndDropText>>();

            builder.RegisterType<QuerableRepository<Answer>>()
                .As<IQuerableRepository<Answer>>();

            builder.RegisterType<QuerableRepository<Dropspot>>()
                .As<IQuerableRepository<Dropspot>>();

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

            base.Load(builder);
        }
    }
}
