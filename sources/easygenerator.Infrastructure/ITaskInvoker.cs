using System;

namespace easygenerator.Infrastructure
{
    public interface ITaskInvoker
    {
        void InvokeTask(ITask task, TimeSpan period);

        event EventHandler<ITask> TaskInvoked;
    }
}
