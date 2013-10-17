using System;
using System.ComponentModel;
using System.Configuration;
using easygenerator.DataAccess;
using easygenerator.DomainModel.Entities;
using RazorEngine;
using System.Web.Hosting;
using System.Collections.Generic;
using easygenerator.DomainModel.Repositories;
using System.Net.Mail;
using System.Web.Caching;
using easygenerator.Web.Components.Configuration;
using easygenerator.DomainModel;

namespace easygenerator.Web.Mail
{
    public class MailNotificationManager
    {
        private readonly IMailNotificationRepository _mailNotificationRepository;
        private readonly IUnitOfWork _dataContext;
        private IEntityFactory _entityFactory;

        private MailSenderConfigurationSection mailSenderSettings;
        private Dictionary<string, MailTemplate> templateConfigurations;
        private const string TemplateLocation = "~/Mail/MailTemplates/{0}.cshtml";
        private const char AddressesSeparator = ';';

        public MailNotificationManager(IEntityFactory factory, IMailNotificationRepository mailRepository, IUnitOfWork unitOfWork)
        {
            _dataContext = unitOfWork;
            _mailNotificationRepository = mailRepository;
            _entityFactory = factory;
            Initialize();
        }

        private void Initialize()
        {
            mailSenderSettings = ConfigurationManager.GetSection("mailSender") as MailSenderConfigurationSection;

            templateConfigurations = new Dictionary<string, MailTemplate>();
            foreach (var mailTemplateSetting in mailSenderSettings.MailTemplates)
            {
                MailTemplate templateSettings = (MailTemplate)mailTemplateSetting;
                templateConfigurations.Add(templateSettings.Name, templateSettings);
            }
        }

        private string GetViewTemplatePath(string templateName)
        {
            var configuration = templateConfigurations[templateName];
            string templatePath = string.IsNullOrEmpty(configuration.ViewPath)
                ? string.Format(TemplateLocation, configuration.Name)
                : configuration.ViewPath;
            return HostingEnvironment.MapPath(templatePath);
        }

        public MailNotification GetMailNotification(string templateName, dynamic templateModel)
        {
            string emailBody = GetMailNotificationBody(templateName, templateModel);
            var templateSettings = templateConfigurations[templateName];
            return _entityFactory.MailNotification(emailBody, templateSettings.Subject, templateSettings.From,
                templateSettings.To, templateSettings.Cc, templateSettings.Bcc);
        }

        private string GetMailNotificationBody(string templateName, dynamic templateModel)
        {
            string physicalPath = GetViewTemplatePath(templateName);
            var template = MailTemplatesProvider.GetMailTemplate(physicalPath);
            var body = Razor.Parse(template, templateModel);
            return body;
        }

        public void SendMailNotifications(int batchSize)
        {
            var mailNotifications = _mailNotificationRepository.GetCollection(batchSize);
            if (mailNotifications != null)
            {
                SmtpClient client = new SmtpClient();


                foreach (var mailNotification in mailNotifications)
                {
                    try
                    {
                        MailMessage message = new MailMessage();
                        foreach (var ccEmail in SplitEmailAddresses(mailNotification.CCEmailAddresses))
                        {
                            message.CC.Add(new MailAddress(ccEmail));
                        }
                        foreach (var bccEmail in SplitEmailAddresses(mailNotification.BCCEmailAddresses))
                        {
                            message.Bcc.Add(new MailAddress(bccEmail));
                        }
                        foreach (var toEmail in SplitEmailAddresses(mailNotification.ToEmailAddresses))
                        {
                            message.To.Add(new MailAddress(toEmail));
                        }

                        message.Subject = mailNotification.Subject;
                        message.IsBodyHtml = true;
                        message.Body = mailNotification.Body;
                        message.From = new MailAddress(mailNotification.FromEmailAddress);

                        client.Send(message);

                        _mailNotificationRepository.Remove(mailNotification);
                        _dataContext.Save();
                    }
                    catch (Exception)
                    {
                        throw;
                    }
                }
            }
        }

        private string[] SplitEmailAddresses(string emailAddresses)
        {
            return !String.IsNullOrEmpty(emailAddresses) ? emailAddresses.Split(AddressesSeparator) : new string[] { };
        }

        public void SetUpMailSenderTask()
        {
            if (mailSenderSettings.Enable)
            {
                AddMailSenderTask("MailSenderTask", mailSenderSettings.Interval);
            }
        }

        private static CacheItemRemovedCallback OnCacheRemove = null;

        private void AddMailSenderTask(string taskName, int interval)
        {
            OnCacheRemove = new CacheItemRemovedCallback(CacheItemRemoved);
            System.Web.HttpRuntime.Cache.Insert(taskName, interval, null,
                DateTime.Now.AddSeconds(interval), Cache.NoSlidingExpiration,
                CacheItemPriority.NotRemovable, OnCacheRemove);
        }

        private void CacheItemRemoved(string k, object v, CacheItemRemovedReason r)
        {
            try
            {
                SendMailNotifications(mailSenderSettings.BatchSize);
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                AddMailSenderTask(k, Convert.ToInt32(v));
            }
        }
    }
}
