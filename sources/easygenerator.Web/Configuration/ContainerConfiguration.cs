using Autofac;
using Autofac.Builder;
using Autofac.Integration.Mvc;
using easygenerator.Auth.Lti;
using easygenerator.DataAccess;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Events;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Clonning;
using easygenerator.Infrastructure.Http;
using easygenerator.Infrastructure.ImageProcessors;
using easygenerator.Infrastructure.Mail;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.BuildCourse.Modules;
using easygenerator.Web.BuildCourse.PublishSettings;
using easygenerator.Web.BuildCourse.Scorm;
using easygenerator.Web.BuildCourse.Scorm.Modules;
using easygenerator.Web.BuildLearningPath;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Components.Elmah;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Components.ModelBinding;
using easygenerator.Web.Components.Tasks;
using easygenerator.Web.Import.Presentation;
using easygenerator.Web.Import.Presentation.HtmlComposers;
using easygenerator.Web.Import.Presentation.Mappers;
using easygenerator.Web.InMemoryStorages;
using easygenerator.Web.InMemoryStorages.CourseStateStorage;
using easygenerator.Web.Mail;
using easygenerator.Web.Newsletter;
using easygenerator.Web.Newsletter.MailChimp;
using easygenerator.Web.Publish;
using easygenerator.Web.Publish.External;
using easygenerator.Web.Security.PermissionsCheckers;
using easygenerator.Web.Storage;
using easygenerator.Web.Synchronization.Broadcasting;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting.CollaboratorProviders;
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
            builder.RegisterType<CourseContentPathProvider>();
            builder.RegisterType<CourseContentProvider>().As<ICourseContentProvider>();

            builder.RegisterType<LearningPathCourseBuilder>().As<ILearningPathCourseBuilder>();
            builder.RegisterType<LearningPathContentPathProvider>();
            builder.RegisterType<LearningPathContentProvider>().As<ILearningPathContentProvider>();
            builder.RegisterType<LearningPathPackageModelMapper>();
            builder.RegisterType<LearningPathBuilder>().As<ILearningPathBuilder>();
            
            builder.RegisterGeneric(typeof(EntityModelBinder<>)).As(typeof(IEntityModelBinder<>));
            builder.RegisterGeneric(typeof(EntityCollectionModelBinder<>)).As(typeof(IEntityCollectionModelBinder<>));

            builder.RegisterType<LearningPathEntityModelBinder>().As<ILearningPathEntityModelBinder>();
            builder.RegisterType<LearningPathEntityCollectionModelBinder>().As<ILearningPathEntityCollectionModelBinder>();

            builder.RegisterType<BuildPathProvider>();
            builder.RegisterType<PhysicalFileManager>();
            builder.RegisterType<MagickImageResizer>().As<IImageResizer>();
            builder.RegisterType<MagickImageResizerConfigurator>();
            builder.RegisterType<MagickAnyCPUWrapper>();
            builder.RegisterType<ManifestFileManager>().SingleInstance();
            builder.RegisterType<HttpRuntimeWrapper>();
            builder.RegisterType<BuildPackageCreator>();
            builder.RegisterType<PackageModelMapper>();
            builder.RegisterType<PackageModelSerializer>();
            builder.RegisterType<BuildPackageCreator>();
            builder.RegisterType<ConfigurationReader>();
            builder.RegisterType<RazorTemplateProvider>().SingleInstance();
            builder.RegisterType<PackageModulesProvider>();
            builder.RegisterType<ScormPackageModulesProvider>();
            builder.RegisterType<PublishSettingsProvider>();
            builder.RegisterType<BranchTrackProvider>();
            
            builder.RegisterModule(new DataAccessModule());

            builder.RegisterType<EntityFactory>().As<IEntityFactory>();

            builder.RegisterType<AuthenticationProvider>().As<IAuthenticationProvider>();
            builder.RegisterType<DependencyResolverWrapper>().As<IDependencyResolverWrapper>();
            builder.RegisterType<TypeMethodInvoker>().As<ITypeMethodInvoker>();

            #region Broadcasting

            builder.RegisterType<Broadcaster>().As<IBroadcaster>();
            RegisterGenericTypes(builder, applicationAssembly, typeof(IEntityCollaboratorProvider<>));
            builder.RegisterGeneric(typeof(CollaborationBroadcaster<>)).As(typeof(ICollaborationBroadcaster<>));
            builder.RegisterType<UserCollaborationBroadcaster>().As<IUserCollaborationBroadcaster>();

            #endregion

            #region Security

            RegisterGenericTypes(builder, Assembly.GetAssembly(typeof(IEntityPermissionsChecker<>)), typeof(IEntityPermissionsChecker<>));

            #endregion

            #region Domain events dependecies

            builder.RegisterType<DomainEventPublisher>().As(typeof(IDomainEventPublisher)).InstancePerLifetimeScope();
            builder.RegisterGeneric(typeof(DomainEventHandlersProvider<>)).As(typeof(IDomainEventHandlersProvider<>)).InstancePerLifetimeScope();
            RegisterGenericTypes(builder, applicationAssembly, typeof(IDomainEventHandler<>)).ForEach(_ => _.InstancePerLifetimeScope());

            #endregion

            #region Entity mapping

            RegisterGenericTypes(builder, applicationAssembly, typeof(IEntityModelMapper<>));
            builder.RegisterType<EntityMapper>().As<IEntityMapper>();
            builder.RegisterType<CollaborationInviteMapper>().As<ICollaborationInviteMapper>();

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
            builder.RegisterType<LearningPathPublisher>().As<ILearningPathPublisher>();
            builder.RegisterType<ExternalCoursePublisher>().As<IExternalCoursePublisher>();
            builder.RegisterType<ExternalLearningPathPublisher>().As<IExternalLearningPathPublisher>();

            #endregion

            #region WooCommerce dependencies

            builder.RegisterType<WooCommerceApiService>().As<IWooCommerceApiService>().SingleInstance();

            #endregion

            #region Http requests sender dependencies

            builder.RegisterType<HttpRequestsSenderTask>().InstancePerLifetimeScope();
            builder.RegisterType<HttpRequestsManager>().As<IHttpRequestsManager>().SingleInstance();

            #endregion

            #region NewsLetter

            builder.RegisterType<MailChimpSubscriptionManager>().As<INewsletterSubscriptionManager>().SingleInstance();
            builder.RegisterType<HttpClient>().As<HttpClient>().SingleInstance();

            #endregion

            #region Scheduler

            builder.RegisterType<Scheduler>().SingleInstance();
            builder.RegisterType<CacheExpirationTaskInvoker>().As<ITaskInvoker>().SingleInstance();

            builder.RegisterType<PasswordRecoveryTicketExpirationTask>().InstancePerLifetimeScope();
            builder.RegisterType<MailSenderTask>().InstancePerLifetimeScope();
            builder.RegisterType<SubscriptionExpirationTask>().InstancePerLifetimeScope();

            #endregion

            #region Import

            builder.RegisterType<PresentationModelMapper>().As<IPresentationModelMapper>();
            builder.RegisterType<ShapeMapper>();
            builder.RegisterType<ParagraphMapper>();
            builder.RegisterType<ParagraphCollectionMapper>();
            builder.RegisterType<ShapePositionReceiver>();
            builder.RegisterType<ShapeHtmlComposer>();
            builder.RegisterType<TableHtmlComposer>();
            builder.RegisterType<SlideHtmlComposer>().As<ISlideHtmlComposer>();
            builder.RegisterType<ImageHtmlComposer>();
            builder.RegisterType<ParagraphHtmlComposer>();
            builder.RegisterType<PresentationCourseImporter>().As<IPresentationCourseImporter>();
            builder.RegisterType<ImageMapper>();
            builder.RegisterType<TableMapper>();

            #endregion

            builder.RegisterType<UrlHelperWrapper>().As<IUrlHelperWrapper>();
            builder.RegisterType<Storage.Storage>().As<IStorage>();
            builder.RegisterType<ImageStorage>().As<IImageStorage>();
            builder.RegisterType<TemplateStorage>().As<ITemplateStorage>();

            builder.RegisterType<FileTypeChecker>().As<IFileTypeChecker>();
            builder.RegisterType<WooCommerceAutologinUrlProvider>().As<IWooCommerceAutologinUrlProvider>();
            builder.RegisterType<CourseStateStorage>().As<ICourseStateStorage>();

            #region Log

            builder.RegisterType<ElmahLog>().As<ILog>().SingleInstance();

            #endregion

            builder.RegisterType<EntityCloner>().As<ICloner>().SingleInstance();
            builder.RegisterType<DemoCoursesInMemoryStorage>().As<IDemoCoursesStorage>().SingleInstance();
            builder.RegisterType<CourseInfoInMemoryStorage>().As<ICourseInfoInMemoryStorage>().SingleInstance();

            #region Auth

            builder.RegisterType<Auth.Providers.JsonWebTokenProvider>().As<Auth.Providers.ITokenProvider>();
            builder.RegisterType<Auth.Repositories.EndpointsRepository>().As<Auth.Repositories.IEndpointsRepository>();

            #endregion

            #region Lti

            builder.RegisterType<LtiAuthProvider>().SingleInstance();

            #endregion

            builder.RegisterType<ReleaseNoteFileReader>().As<IReleaseNoteFileReader>().SingleInstance();

            var container = builder.Build();

            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));

            DependencyResolver.Current.GetService<IDemoCoursesStorage>().Initialize();
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