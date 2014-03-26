﻿using System;
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
            var mailSenderSettings = DependencyResolver.Current.GetService<MailSettings>();
            var cacheScheduler = DependencyResolver.Current.GetService<Scheduler>();
            var passwordRecoveryTicketExpirationTask = DependencyResolver.Current.GetService<PasswordRecoveryTicketExpirationTask>();
            var configurationReader = DependencyResolver.Current.GetService<ConfigurationReader>();

            cacheScheduler.ScheduleTask(passwordRecoveryTicketExpirationTask, new TimeSpan(0, 0, 2, 0));

            if (mailSenderSettings.MailSenderSettings.Enable)
            {
                var mailSenderTask = DependencyResolver.Current.GetService<MailSenderTask>();
                cacheScheduler.ScheduleTask(mailSenderTask, new TimeSpan(0, 0, 0, mailSenderSettings.MailSenderSettings.Interval));
            }

            if (configurationReader.HttpRequestsSenderConfiguration.Enabled)
            {
                var httpRequestsSenderTask = DependencyResolver.Current.GetService<HttpRequestsSenderTask>();
                cacheScheduler.ScheduleTask(httpRequestsSenderTask, new TimeSpan(0, 0, 0, configurationReader.HttpRequestsSenderConfiguration.Interval));
            }
        }
    }
}