using Autofac;
using easygenerator.DataAccess.Repositories;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using System.Data.Entity;

namespace easygenerator.DataAccess
{
    public class DataAccessModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            Database.SetInitializer(new CreateDatabaseIfNotExists<DatabaseContext>());

            builder.RegisterType<DatabaseContext>()
                .As<IDataContext>()
                .As<IUnitOfWork>()
                .InstancePerLifetimeScope();

            builder.RegisterType<ObjectiveRepository>()
                .As<IObjectiveRepository>()
                .As<IQuerableRepository<Objective>>();

            builder.RegisterType<ExperienceRepository>()
                .As<IExperienceRepository>()
                .As<IQuerableRepository<Experience>>();

            builder.RegisterType<TemplateRepository>()
                .As<ITemplateRepository>()
                .As<IQuerableRepository<Template>>();

            builder.RegisterType<QuerableRepository<Question>>()
                .As<IQuerableRepository<Question>>();

            builder.RegisterType<QuerableRepository<Answer>>()
                .As<IQuerableRepository<Answer>>();

            builder.RegisterType<QuerableRepository<LearningObject>>()
                .As<IQuerableRepository<LearningObject>>();

            builder.RegisterType<UserRepository>()
                .As<IUserRepository>()
                .As<IQuerableRepository<User>>();

            builder.RegisterType<HelpHintRepository>()
                .As<IHelpHintRepository>()
                .As<IQuerableRepository<HelpHint>>();

            builder.RegisterType<MailNotificationRepository>()
                .As<IMailNotificationRepository>()
                .As<IQuerableRepository<MailNotification>>();

            base.Load(builder);
        }
    }
}
