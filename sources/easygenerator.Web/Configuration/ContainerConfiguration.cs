using System.Web.Mvc;
using Autofac;
using Autofac.Integration.Mvc;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildExperience;
using easygenerator.Web.Repositories;

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

            builder.RegisterType<BuildHelper>()
                   .As<IBuildHelper>();

            builder.RegisterType<PhysicalFileManager>()
                   .As<IPhysicalFileManager>();

            var container = builder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
        }
    }
}