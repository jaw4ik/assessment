using System;
using System.Web.Mvc;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Components.Tasks;
using easygenerator.Web.Mail;

namespace easygenerator.Web.Configuration
{
    public class TaskConfiguration
    {
        public static void Configure()
        {
            var cacheScheduler = DependencyResolver.Current.GetService<Scheduler>();
            var mailSenderSettings = DependencyResolver.Current.GetService<MailSettings>();
            var configurationReader = DependencyResolver.Current.GetService<ConfigurationReader>();

            cacheScheduler.ScheduleTask(typeof(PasswordRecoveryTicketExpirationTask), new TimeSpan(0, 0, 2, 0));
            cacheScheduler.ScheduleTask(typeof(SubscriptionExpirationTask), new TimeSpan(0, 0, 0, 2));

            if (mailSenderSettings.MailSenderSettings.Enable)
            {
                cacheScheduler.ScheduleTask(typeof(MailSenderTask), new TimeSpan(0, 0, 0, mailSenderSettings.MailSenderSettings.Interval));
            }

            if (configurationReader.HttpRequestsSenderConfiguration.Enabled)
            {
                cacheScheduler.ScheduleTask(typeof(HttpRequestsSenderTask), new TimeSpan(0, 0, 0, configurationReader.HttpRequestsSenderConfiguration.Interval));
            }
        }
    }
}