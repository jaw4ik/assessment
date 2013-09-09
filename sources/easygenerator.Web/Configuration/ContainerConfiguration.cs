using System.Web.Mvc;
using Autofac;
using Autofac.Integration.Mvc;
using easygenerator.DataAccess;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildExperience;

namespace easygenerator.Web.Configuration
{
    public static class ContainerConfiguration
    {
        public static void Configure()
        {
            var builder = new ContainerBuilder();

            builder.RegisterControllers(typeof(MvcApplication).Assembly);

            builder.RegisterType<ObjectiveRepository>()
                   .As<IObjectiveRepository>()
                   .As<IRepository<Objective>>().SingleInstance();

            builder.RegisterType<ExperienceBuilder>()
                   .As<IExperienceBuilder>();

            builder.RegisterType<BuildPathProvider>();
            builder.RegisterType<PhysicalFileManager>();
            builder.RegisterType<HttpRuntimeWrapper>();
            builder.RegisterType<BuildPackageCreator>();
            builder.RegisterType<PackageModelMapper>();
            builder.RegisterType<PackageModelSerializer>();
            builder.RegisterType<BuildPackageCreator>();

            builder.RegisterType<InMemoryDataContext>().As<IDataContext>().SingleInstance();
            builder.RegisterType<ObjectiveRepository>().As<IObjectiveRepository>();

            builder.RegisterType<ExperienceRepository>().As<IExperienceRepository>();

            builder.RegisterType<EntityFactory>().As<IEntityFactory>();

            var container = builder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
        }
    }
}