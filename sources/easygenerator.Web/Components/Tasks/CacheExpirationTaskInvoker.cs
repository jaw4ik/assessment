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
                if (TaskInvoked != null)
                {
                    TaskInvoked(this, (ITask)v);
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