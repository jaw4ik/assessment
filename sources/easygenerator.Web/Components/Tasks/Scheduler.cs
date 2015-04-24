using System;
using System.Collections.Generic;
using System.Linq;
using easygenerator.Infrastructure;

namespace easygenerator.Web.Components.Tasks
{
    public class Scheduler : IScheduler
    {
        private readonly ITaskInvoker _taskInvoker;
        private readonly Dictionary<Type, TimeSpan> _tasks;

        public IQueryable<Type> Tasks
        {
            get { return _tasks.Keys.AsQueryable(); }
        }

        public Scheduler(ITaskInvoker periodicSchedulerTimer)
        {
            _taskInvoker = periodicSchedulerTimer;
            _taskInvoker.TaskInvoked += PeriodicSchedulerTimerTaskInvoked;

            _tasks = new Dictionary<Type, TimeSpan>();
        }

        public void ScheduleTask(Type taskType, TimeSpan interval)
        {
            _tasks.Add(taskType, interval);
            _taskInvoker.InvokeTask(taskType, interval);
        }

        void PeriodicSchedulerTimerTaskInvoked(object sender, Type taskType)
        {
            if (!Tasks.Any(t => t == taskType))
            {
                return;
            }

            _taskInvoker.InvokeTask(taskType, _tasks[taskType]);
        }        
    }
}