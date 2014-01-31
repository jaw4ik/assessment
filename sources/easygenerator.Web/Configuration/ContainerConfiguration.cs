﻿using System.Linq;
using System.Web.Mvc;
using Autofac;
using Autofac.Builder;
using Autofac.Integration.Mvc;
using easygenerator.DataAccess;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Handlers;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.BuildCourse.Scorm;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Components.ModelBinding;
using System.Reflection;
using System;
using System.Collections.Generic;
using easygenerator.Web.Components.RouteConstraints;
using easygenerator.Web.Components.Tasks;
using easygenerator.Web.Mail;
using easygenerator.DomainModel.Events;
using easygenerator.Web.Publish;
using easygenerator.Web.Newsletter;
using easygenerator.Web.Newsletter.MailChimp;
using easygenerator.Web.Components.Http;
using easygenerator.Web.Storage;

namespace easygenerator.Web.Configuration
{
    public static class ContainerConfiguration
    {
        public static void Configure()
        {
            var builder = new ContainerBuilder();

            var applicationAssembly = typeof(MvcApplication).Assembly;
            builder.RegisterControllers(applicationAssembly);

            builder.RegisterFilterProvider();

            builder.RegisterType<CourseBuilder>().As<ICourseBuilder>();
            builder.RegisterType<ScormCourseBuilder>().As<IScormCourseBuilder>();

            builder.RegisterGeneric(typeof(EntityModelBinder<>)).As(typeof(IEntityModelBinder<>));
            builder.RegisterGeneric(typeof(EntityCollectionModelBinder<>)).As(typeof(IEntityCollectionModelBinder<>));

            builder.RegisterType<BuildPathProvider>();
            builder.RegisterType<BuildContentProvider>();
            builder.RegisterType<PhysicalFileManager>();
            builder.RegisterType<HttpRuntimeWrapper>();
            builder.RegisterType<BuildPackageCreator>();
            builder.RegisterType<PackageModelMapper>();
            builder.RegisterType<PackageModelSerializer>();
            builder.RegisterType<BuildPackageCreator>();
            builder.RegisterType<SignupFromTryItNowHandler>().As<ISignupFromTryItNowHandler>();
            builder.RegisterType<ConfigurationReader>();
            builder.RegisterType<RazorTemplateProvider>().SingleInstance();

            builder.RegisterModule(new DataAccessModule());

            builder.RegisterType<EntityFactory>().As<IEntityFactory>();

            builder.RegisterType<AuthenticationProvider>().As<IAuthenticationProvider>();

            #region Domain events dependecies

            builder.RegisterGeneric(typeof(DomainEventPublisher<>)).As(typeof(IDomainEventPublisher<>)).InstancePerHttpRequest();
            builder.RegisterGeneric(typeof(DomainEventHandlersProvider<>)).As(typeof(IDomainEventHandlersProvider<>)).InstancePerHttpRequest();
            RegisterGenericTypes(builder, applicationAssembly, typeof(IDomainEventHandler<>)).ForEach(_ => _.InstancePerHttpRequest());

            #endregion

            #region Mail sender dependecies

            builder.RegisterType<MailTemplatesProvider>().SingleInstance();
            builder.RegisterType<MailNotificationManager>().As<IMailNotificationManager>().SingleInstance();
            builder.RegisterType<MailSender>().As<IMailSender>().SingleInstance();
            builder.RegisterType<MailSenderWrapper>().As<IMailSenderWrapper>().SingleInstance();
            builder.RegisterType<MailSettings>().SingleInstance();
            builder.RegisterType<MailSenderTask>().SingleInstance();

            #endregion

            #region Publisher dependencies

            builder.RegisterType<CoursePublisher>().As<ICoursePublisher>();
            builder.RegisterType<CoursePublishingService>().As<ICoursePublishingService>();
            builder.RegisterType<PublishDispatcher>().As <IPublishDispatcher>().SingleInstance();
            builder.RegisterType<PublishIsInProgressConstraint>();

            #endregion

            #region NewsLetter

            builder.RegisterType<MailChimpSubscriptionManager>().As<INewsletterSubscriptionManager>().SingleInstance();
            builder.RegisterType<HttpHelper>().As<HttpHelper>().SingleInstance();

            #endregion

            #region Scheduler

            builder.RegisterType<Scheduler>().SingleInstance();

            builder.RegisterType<PasswordRecoveryTicketExpirationTask>().SingleInstance();
            builder.RegisterType<MailSenderTask>().SingleInstance();
            builder.RegisterType<CacheExpirationTaskInvoker>().As<ITaskInvoker>().SingleInstance();

            #endregion

            builder.RegisterType<UrlHelperWrapper>().As<IUrlHelperWrapper>();
            builder.RegisterType<Storage.Storage>().As<IStorage>();

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