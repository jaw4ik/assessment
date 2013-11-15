using System;

namespace easygenerator.Infrastructure
{
    public interface IScheduler
    {
        void ScheduleTask(ITask task, TimeSpan interval);
    }
}
