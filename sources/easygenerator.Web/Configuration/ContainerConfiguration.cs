﻿using Autofac;
using Autofac.Builder;
using Autofac.Integration.Mvc;
using easygenerator.DataAccess;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Handlers;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Http;
using easygenerator.Infrastructure.Mail;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.BuildCourse.Scorm;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Components.Elmah;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Components.ModelBinding;
using easygenerator.Web.Components.Tasks;
using easygenerator.Web.Import.PublishedCourse;
using easygenerator.Web.Import.PublishedCourse.EntityReaders;
using easygenerator.Web.Mail;
using easygenerator.Web.Newsletter;
using easygenerator.Web.Newsletter.MailChimp;
using easygenerator.Web.Permissions;
using easygenerator.Web.Publish;
using easygenerator.Web.Publish.Aim4You;
using easygenerator.Web.Storage;
using easygenerator.Web.Synchronization.Broadcasting;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting;
using easygenerator.Web.WooCommerce;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web.Mvc;

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
            builder.RegisterType<DependencyResolverWrapper>().As<IDependencyResolverWrapper>();

            #region Broadcasting

            builder.RegisterType<Broadcaster>().As<IBroadcaster>();
            builder.RegisterType<CourseCollaborationBroadcaster>().As<ICollaborationBroadcaster<Course>>();
            builder.RegisterType<ObjectiveCollaborationBroadcaster>().As<ICollaborationBroadcaster<Objective>>();
            builder.RegisterType<QuestionCollaborationBroadcaster>().As<ICollaborationBroadcaster<Question>>();

            #endregion

            #region Permission checkers

            RegisterGenericTypes(builder, applicationAssembly, typeof(IEntityPermissionsChecker<>));

            #endregion

            #region Domain events dependecies

            builder.RegisterType<DomainEventPublisher>().As(typeof(IDomainEventPublisher)).InstancePerRequest();
            builder.RegisterGeneric(typeof(DomainEventHandlersProvider<>)).As(typeof(IDomainEventHandlersProvider<>)).InstancePerRequest();
            RegisterGenericTypes(builder, applicationAssembly, typeof(IDomainEventHandler<>)).ForEach(_ => _.InstancePerRequest());

            #endregion

            #region Entity mapping

            RegisterGenericTypes(builder, applicationAssembly, typeof(IEntityModelMapper<>));
            builder.RegisterType<EntityMapper>().As<IEntityMapper>();

            #endregion

            #region Mail sender dependecies

            builder.RegisterType<MailTemplatesProvider>().As<IMailTemplatesProvider>().SingleInstance();
            builder.RegisterType<MailNotificationManager>().As<IMailNotificationManager>().SingleInstance();
            builder.RegisterType<MailSender>().As<IMailSender>().SingleInstance();
            builder.RegisterType<MailSenderWrapper>().As<IMailSenderWrapper>().SingleInstance();
            builder.RegisterType<MailSettings>().As<MailSettings>().As<IMailSettings>().SingleInstance();
            builder.RegisterType<MailSenderTask>().SingleInstance();

            #endregion

            #region Publisher dependencies

            builder.RegisterType<CoursePublisher>().As<ICoursePublisher>();

            #endregion

            #region Aim4You dependencies

            builder.RegisterType<Aim4YouApiService>().As<IAim4YouApiService>().SingleInstance();
            builder.RegisterType<Aim4YouCoursePublisher>().As<IAim4YouCoursePublisher>().SingleInstance();
            builder.RegisterType<Aim4YouHttpClient>().As<Aim4YouHttpClient>().SingleInstance();

            #endregion

            #region WooCommerce dependencies

            builder.RegisterType<WooCommerceApiService>().As<IWooCommerceApiService>().SingleInstance();

            #endregion

            #region Http requests sender dependencies

            builder.RegisterType<HttpRequestsSenderTask>().SingleInstance();
            builder.RegisterType<HttpRequestsManager>().As<IHttpRequestsManager>().SingleInstance();

            #endregion

            #region NewsLetter

            builder.RegisterType<MailChimpSubscriptionManager>().As<INewsletterSubscriptionManager>().SingleInstance();
            builder.RegisterType<HttpClient>().As<HttpClient>().SingleInstance();

            #endregion

            #region Scheduler

            builder.RegisterType<Scheduler>().SingleInstance();

            builder.RegisterType<PasswordRecoveryTicketExpirationTask>().SingleInstance();
            builder.RegisterType<MailSenderTask>().SingleInstance();
            builder.RegisterType<CacheExpirationTaskInvoker>().As<ITaskInvoker>().SingleInstance();

            #endregion

            #region Import

            builder.RegisterType<PublishedCourseStructureReader>();
            builder.RegisterType<ImportContentReader>();
            builder.RegisterType<CourseEntityReader>();
            builder.RegisterType<ObjectiveEntityReader>();
            builder.RegisterType<QuestionEntityReader>();
            builder.RegisterType<AnswerEntityReader>();
            builder.RegisterType<LearningContentEntityReader>();
            builder.RegisterType<PublishedCourseImporter>();

            #endregion

            builder.RegisterType<UrlHelperWrapper>().As<IUrlHelperWrapper>();
            builder.RegisterType<Storage.Storage>().As<IStorage>();

            builder.RegisterType<ImageValidator>().As<IImageValidator>();
            builder.RegisterType<WooCommerceAutologinUrlProvider>().As<IWooCommerceAutologinUrlProvider>();

            #region Log

            builder.RegisterType<ElmahLog>().As<ILog>().SingleInstance();

            #endregion

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
                    builders.Add(builder.RegisterGeneric(type).AsImplementedInterfaces().InstancePerRequest());
                else
                    builders.Add(builder.RegisterType(type).AsImplementedInterfaces().InstancePerRequest());
            }

            return builders;
        }
    }
}