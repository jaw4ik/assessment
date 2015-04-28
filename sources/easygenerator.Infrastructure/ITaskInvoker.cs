using System;

namespace easygenerator.Infrastructure
{
    public interface ITaskInvoker
    {
        void InvokeTask(Type task, TimeSpan period);

        event EventHandler<Type> TaskInvoked;
    }
}
