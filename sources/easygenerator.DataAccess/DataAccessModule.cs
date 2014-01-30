using Autofac;
using easygenerator.DataAccess.Repositories;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

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

            builder.RegisterType<QuerableRepository<Answer>>()
                .As<IQuerableRepository<Answer>>();

            builder.RegisterType<QuerableRepository<LearningContent>>()
                .As<IQuerableRepository<LearningContent>>();

            builder.RegisterType<UserRepository>()
                .As<IUserRepository>()
                .As<IQuerableRepository<User>>();

            builder.RegisterType<PasswordRecoveryTicketRepository>()
                .As<IPasswordRecoveryTicketRepository>()
                .As<IQuerableRepository<PasswordRecoveryTicket>>();

            builder.RegisterType<HelpHintRepository>()
                .As<IHelpHintRepository>()
                .As<IQuerableRepository<HelpHint>>();

            builder.RegisterType<MailNotificationRepository>()
                .As<IMailNotificationRepository>()
                .As<IQuerableRepository<MailNotification>>();

            builder.RegisterType<ImageFileRepository>()
                .As<IImageFileRepository>()
                .As<IQuerableRepository<ImageFile>>();

            base.Load(builder);
        }
    }
}
