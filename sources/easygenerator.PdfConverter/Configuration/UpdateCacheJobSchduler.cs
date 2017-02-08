using easygenerator.PdfConverter.Components.Configuration;
using easygenerator.PdfConverter.JobSheduler;
using Quartz;
using Quartz.Impl;
using System.Configuration;

namespace easygenerator.PdfConverter.Configuration
{
    public class UpdateCacheJobSchduler
    {
        public static void Start()
        {
            IScheduler sheduler = StdSchedulerFactory.GetDefaultScheduler();
            sheduler.Start();

            IJobDetail job = JobBuilder.Create<UpdateCacheJob>().Build();

            ITrigger trigger = TriggerBuilder.Create()
                .WithSimpleSchedule
                (s =>
                    s.WithIntervalInHours
                    (
                        (ConfigurationManager.GetSection("jobShedulerTime") as JobShedulerTimeConfigurationSection).ShedulerIntervalRepeatTimeInHours
                    )
                    .RepeatForever()
                )
                .Build();

            sheduler.ScheduleJob(job, trigger);
        }
    }
}