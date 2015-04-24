using System;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Tasks
{
    [TestClass]
    public class SchedulerTest
    {
        private Scheduler _scheduler;
        private Type _task;
        private ITaskInvoker _taskInvoker;
        private TimeSpan _interval;

        [TestInitialize]
        public void InitializePublisher()
        {
            _taskInvoker = Substitute.For<ITaskInvoker>();
            _scheduler = new Scheduler(_taskInvoker);

            _task = typeof(ITask);
            _interval = new TimeSpan(0, 0, 2, 0);
        }

        #region ScheduleTask

        [TestMethod]
        public void ScheduleTask_ShouldInvokeTask()
        {
            //Arrange


            //Act
            _scheduler.ScheduleTask(_task, _interval);

            //Assert
            _taskInvoker.Received().InvokeTask(_task, _interval);
        }

        [TestMethod]
        public void ScheduleTask_ShouldInvokeTaskAgian_WhenTaskWasInvoked()
        {
            //Arrange
            _scheduler.ScheduleTask(_task, _interval);

            //Act
            _taskInvoker.TaskInvoked += Raise.Event<EventHandler<Type>>(this, _task);

            //Assert
            _taskInvoker.Received().InvokeTask(_task, _interval);
        }

        [TestMethod]
        public void ScheduleTask_ShouldNotInvokeTask_WhenTaskDoesNotExist()
        {
            //Arrange

            //Act
            _taskInvoker.TaskInvoked += Raise.Event<EventHandler<Type>>(this, Substitute.For<Type>());

            //Assert
            _taskInvoker.DidNotReceive().InvokeTask(_task, _interval);
        }

        #endregion
    }
}
