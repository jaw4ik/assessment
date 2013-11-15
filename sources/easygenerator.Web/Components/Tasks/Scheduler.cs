using System;
using System.Collections.Generic;
using System.Linq;
using easygenerator.Infrastructure;

namespace easygenerator.Web.Components.Tasks
{
    public class Scheduler : IScheduler
    {
        private readonly ITaskInvoker _taskInvoker;
        private readonly Dictionary<ITask, TimeSpan> _tasks;

        public IQueryable<ITask> Tasks
        {
            get { return _tasks.Keys.AsQueryable(); }
        }

        public Scheduler(ITaskInvoker periodicSchedulerTimer)
        {
            _taskInvoker = periodicSchedulerTimer;
            _taskInvoker.TaskInvoked += PeriodicSchedulerTimerTaskInvoked;

            _tasks = new Dictionary<ITask, TimeSpan>();
        }

        public void ScheduleTask(ITask task, TimeSpan interval)
        {
            _tasks.Add(task, interval);
            _taskInvoker.InvokeTask(task, interval);
        }

        void PeriodicSchedulerTimerTaskInvoked(object sender, ITask task)
        {
            if (!Tasks.Any(t => t == task))
            {
                return;
            }

            _taskInvoker.InvokeTask(task, _tasks[task]);
        }        
    }
}