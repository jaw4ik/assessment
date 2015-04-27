using System;
using System.IO;
using System.Web;
using System.Web.Caching;
using System.Web.Mvc;
using easygenerator.Infrastructure;

namespace easygenerator.Web.Components.Tasks
{
    public class CacheExpirationTaskInvoker : ITaskInvoker
    {
        private readonly ILog _logger;

        public CacheExpirationTaskInvoker(ILog logger)
        {
            _logger = logger;
        }

        private void CacheExpired(string k, object v, CacheItemRemovedReason r)
        {
            var taskType = (Type)v;
            if (!typeof(ITask).IsAssignableFrom(taskType))
            {
                return;
            }

            var fakeHttpRequest = new HttpRequest(taskType.Name, "http://background.tasks", String.Empty);
            var fakeHttpResponse = new HttpResponse(TextWriter.Null);
            HttpContext.Current = new HttpContext(fakeHttpRequest, fakeHttpResponse);

            var task = (ITask)DependencyResolver.Current.GetService(taskType);
            try
            {
                var unitOfWork = DependencyResolver.Current.GetService<IUnitOfWork>();
                task.Execute();
                unitOfWork.Save();
            }
            catch (Exception e)
            {
                _logger.LogException(e);
            }
            finally
            {
                if (TaskInvoked != null)
                {
                    TaskInvoked(this, taskType);
                }
            }
        }

        public void InvokeTask(Type taskType, TimeSpan period)
        {
            HttpRuntime.Cache.Insert(Guid.NewGuid().ToString(), taskType, null, DateTime.UtcNow.Add(period), Cache.NoSlidingExpiration, CacheItemPriority.NotRemovable, CacheExpired);
        }

        public event EventHandler<Type> TaskInvoked;
    }
}