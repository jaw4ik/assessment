using System;

namespace easygenerator.Infrastructure
{
    public interface IScheduler
    {
        void ScheduleTask(Type taskType, TimeSpan interval);
    }
}
