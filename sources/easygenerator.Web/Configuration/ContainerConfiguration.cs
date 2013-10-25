using System.Linq;
using System.Web.Mvc;
using Autofac;
using Autofac.Builder;
using Autofac.Integration.Mvc;
using easygenerator.DataAccess;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Handlers;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildExperience;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Components.ModelBinding;
using System.Reflection;
using System;
using System.Collections.Generic;
using easygenerator.Web.Mail;
using easygenerator.DomainModel.Events;

namespace easygenerator.Web.Configuration
{
    public static class ContainerConfiguration
    {
        public static void Configure()
        {
            var builder = new ContainerBuilder();

            var applicationAssembly = typeof(MvcApplication).Assembly;
            builder.RegisterControllers(applicationAssembly);

            builder.RegisterType<ExperienceBuilder>()
                   .As<IExperienceBuilder>();

            builder.RegisterGeneric(typeof(EntityModelBinder<>)).As(typeof(IEntityModelBinder<>));
            builder.RegisterGeneric(typeof(EntityCollectionModelBinder<>)).As(typeof(IEntityCollectionModelBinder<>));

            builder.RegisterType<BuildPathProvider>();
            builder.RegisterType<PhysicalFileManager>();
            builder.RegisterType<HttpRuntimeWrapper>();
            builder.RegisterType<BuildPackageCreator>();
            builder.RegisterType<PackageModelMapper>();
            builder.RegisterType<PackageModelSerializer>();
            builder.RegisterType<BuildPackageCreator>();
            builder.RegisterType<SignupFromTryItNowHandler>().As<ISignupFromTryItNowHandler>();
            builder.RegisterType<ConfigurationReader>();

            builder.RegisterModule(new DataAccessModule());

            builder.RegisterType<EntityFactory>().As<IEntityFactory>();

            builder.RegisterType<AuthenticationProvider>().As<IAuthenticationProvider>();

            #region Register domain events dependecies

            builder.RegisterGeneric(typeof(DomainEventPublisher<>)).As(typeof(IDomainEventPublisher<>)).InstancePerHttpRequest();
            builder.RegisterGeneric(typeof(DomainEventHandlersProvider<>)).As(typeof(IDomainEventHandlersProvider<>)).InstancePerHttpRequest();
            RegisterGenericTypes(builder, applicationAssembly, typeof(IDomainEventHandler<>)).ForEach(_ => _.InstancePerHttpRequest());

            #endregion

            builder.RegisterType<MailNotificationManager>().As<IMailNotificationManager>().SingleInstance();
            builder.RegisterType<MailSender>().As<IMailSender>().SingleInstance();
            builder.RegisterType<MailSenderWrapper>().As<IMailSenderWrapper>().SingleInstance();
            builder.RegisterType<MailSettings>().SingleInstance();
            builder.RegisterType<MailSenderTask>().SingleInstance();

            builder.RegisterType<UrlHelperWrapper>().As<IUrlHelperWrapper>();

            var container = builder.Build();

            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
        }

        private static bool IsAssignableToGenericType(Type givenType, Type genericType)
        {
            var interfaceTypes = givenType.GetInterfaces();

            if (interfaceTypes.Where(it => it.IsGenericType).Any(it => it.GetGenericTypeDefinition() == genericType))
                return true;

            var baseType = givenType.BaseType;
            if (baseType == null) return false;

            return baseType.IsGenericType &&
                   baseType.GetGenericTypeDefinition() == genericType ||
                   IsAssignableToGenericType(baseType, genericType);
        }

        private static List<IRegistrationBuilder<object, object, object>> RegisterGenericTypes(ContainerBuilder builder, Assembly assembly, Type genericRepositoryType)
        {
            var builders = new List<IRegistrationBuilder<object, object, object>>();

            var types = assembly.GetExportedTypes().Where(t => !t.IsInterface && !t.IsAbstract && IsAssignableToGenericType(t, genericRepositoryType)).ToArray();

            foreach (var type in types)
            {
                if (type.IsGenericType)
                    builders.Add(builder.RegisterGeneric(type).AsImplementedInterfaces().InstancePerHttpRequest());
                else
                    builders.Add(builder.RegisterType(type).AsImplementedInterfaces().InstancePerHttpRequest());
            }

            return builders;
        }
    }
}