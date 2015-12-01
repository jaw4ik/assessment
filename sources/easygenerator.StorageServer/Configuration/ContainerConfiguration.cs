using System.Reflection;
using Autofac;
using Autofac.Integration.WebApi;
using easygenerator.StorageServer.Attributes;
using easygenerator.StorageServer.Components.Dispatchers;
using easygenerator.StorageServer.Controllers;
using easygenerator.StorageServer.DataAccess;
using easygenerator.StorageServer.Models.Entities;
using easygenerator.StorageServer.Repositories;
using Microsoft.Owin;
using Owin;
using System.Web.Http;
using easygenerator.StorageServer.Components.Authorization;
using easygenerator.StorageServer.Components.Convertion;
using easygenerator.StorageServer.Components.Elmah;
using easygenerator.StorageServer.Components.Vimeo;

namespace easygenerator.StorageServer.Configuration
{
    public static class ContainerConfiguration
    {
        public static void Configure(IAppBuilder app, HttpConfiguration config)
        {
            var builder = new ContainerBuilder();

            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());
            builder.RegisterWebApiFilterProvider(config);
            
            builder.RegisterType<ElmahLog>().As<ILog>();
            builder.RegisterType<AuthorizationService>().As<IAuthorizationService>();
            builder.RegisterType<VimeoDelete>().As<IVimeoDelete>().SingleInstance();
            builder.RegisterType<VimeoPutUpload>().As<IVimeoPutUpload>().SingleInstance();
            builder.RegisterType<VimeoPullUpload>().As<IVimeoPullUpload>().SingleInstance();
            builder.RegisterType<VimeoGetSources>().As<IVimeoGetSources>().SingleInstance();
            builder.RegisterType<VimeoUploadDispatcher>().As<IVimeoUploadDispatcher>().SingleInstance();
            builder.RegisterType<PermissionsDispatcher>().As<IPermissionsDispatcher>().SingleInstance();
           
            builder.RegisterType<DatabaseContext>().As<IDataContext>().As<IUnitOfWork>().InstancePerLifetimeScope();

            builder.RegisterType<UserRepository>().As<IUserRepository>();
            builder.RegisterType<Repository<Video>>().As<IRepository<Video>>();
            builder.RegisterType<Repository<Audio>>().As<IRepository<Audio>>();

            builder.RegisterType<ConvertionService>().As<IConvertionService>();

            builder.RegisterType<Components.Configuration>();

            builder.Register(c => new UnitOfWorkFilter(c.Resolve<IUnitOfWork>())).AsWebApiActionFilterFor<DefaultStorageApiController>().InstancePerLifetimeScope();

            var container = builder.Build();

            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);

            app.UseAutofacMiddleware(container);
            app.UseAutofacWebApi(config);
            app.UseWebApi(config);
        }

    }
}
