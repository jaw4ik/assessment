using System;
using System.Web;
using System.Web.Caching;
using easygenerator.Infrastructure;

namespace easygenerator.Web.Components.Tasks
{
    public class CacheExpirationTaskInvoker : ITaskInvoker
    {
        private void CacheExpired(string k, object v, CacheItemRemovedReason r)
        {
            try
            {
                var task = (ITask) v;

                task.Execute();

                if (TaskInvoked != null)
                {
                    TaskInvoked(this, task);
                }
            }
            catch (Exception e)
            {
                ElmahLog.LogException(e);
            }
        }

        public void InvokeTask(ITask task, TimeSpan period)
        {
            HttpRuntime.Cache.Insert(Guid.NewGuid().ToString(), task, null, DateTime.UtcNow.Add(period), Cache.NoSlidingExpiration, CacheItemPriority.NotRemovable, CacheExpired);
        }

        public event EventHandler<ITask> TaskInvoked;
    }
}