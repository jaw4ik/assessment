using System;
using Autofac;
using Autofac.Integration.WebApi;
using easygenerator.Infrastructure;
using easygenerator.PublicationServer.ActionFilters;
using easygenerator.PublicationServer.Constraints;
using System.Reflection;
using System.Web.Http;
using easygenerator.PublicationServer.MultipartFormData;
using easygenerator.PublicationServer.Publish;

namespace easygenerator.PublicationServer.Configuration
{
    public static class ContainerConfiguration
    {
        public static void ConfigurePublicationApiContainer(HttpConfiguration config)
        {
            ConfigureContainer(config, builder =>
            {
                builder.RegisterType<GeneralExceptionFilterAttribute>().As<GeneralExceptionFilterAttribute>().SingleInstance();
                builder.RegisterType<PublishDispatcher>().As<IPublishDispatcher>().SingleInstance();
                builder.RegisterType<PhysicalFileManager>().As<PhysicalFileManager>().SingleInstance();
                builder.RegisterType<MaintenanceRouteConstraint>().As<MaintenanceRouteConstraint>().SingleInstance();
                builder.RegisterType<ElmahLog>().As<ILog>().SingleInstance();
                builder.RegisterType<PublicationPathProvider>().As<PublicationPathProvider>().SingleInstance();
                builder.RegisterType<CoursePublisher>().As<ICoursePublisher>().SingleInstance();
                builder.RegisterType<CourseMultipartFormDataManager>().As<CourseMultipartFormDataManager>().SingleInstance();
                builder.RegisterType<ConfigurationReader>().As<ConfigurationReader>().SingleInstance();
                builder.RegisterType<StaticViewContentProvider>().As<StaticViewContentProvider>().SingleInstance();
            });
        }

        public static void ConfigurePageNotFoundContainer(HttpConfiguration config)
        {
            ConfigureContainer(config, builder =>
            {
                builder.RegisterType<GeneralExceptionFilterAttribute>().As<GeneralExceptionFilterAttribute>().SingleInstance();
                builder.RegisterType<PhysicalFileManager>().As<PhysicalFileManager>().SingleInstance();
                builder.RegisterType<PublicationPathProvider>().As<PublicationPathProvider>().SingleInstance();
                builder.RegisterType<StaticViewContentProvider>().As<StaticViewContentProvider>().SingleInstance();
            });
        }

        private static void ConfigureContainer(HttpConfiguration config, Action<ContainerBuilder> registerTypesAction)
        {
             var builder = new ContainerBuilder();
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());
            builder.RegisterWebApiFilterProvider(config);

            registerTypesAction(builder);

            var container = builder.Build();
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
        }
    }
}
