using System;
using System.Web.Mvc;
using easygenerator.Web.Components.Tasks;
using easygenerator.Web.Mail;

namespace easygenerator.Web.Configuration
{
    public class TaskConfiguration
    {
        public static void Configure()
        {
            var mailSenderSettings = DependencyResolver.Current.GetService<MailSettings>();
            var cacheScheduler = DependencyResolver.Current.GetService<Scheduler>();
            var passwordRecoveryTicketExpirationTask = DependencyResolver.Current.GetService<PasswordRecoveryTicketExpirationTask>();
            var accessTypeExpirationTask = DependencyResolver.Current.GetService<AccessTypeExpirationTask>();

            cacheScheduler.ScheduleTask(passwordRecoveryTicketExpirationTask, new TimeSpan(0, 0, 2, 0));
            cacheScheduler.ScheduleTask(accessTypeExpirationTask, new TimeSpan(0, 0, 0, 30));

            if (mailSenderSettings.MailSenderSettings.Enable)
            {
                var mailSenderTask = DependencyResolver.Current.GetService<MailSenderTask>();
                cacheScheduler.ScheduleTask(mailSenderTask, new TimeSpan(0, 0, 0, mailSenderSettings.MailSenderSettings.Interval));
            }
        }
    }
}