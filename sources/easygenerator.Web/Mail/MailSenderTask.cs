using easygenerator.DataAccess;
using easygenerator.DomainModel.Repositories;
using System;
using System.Web;
using System.Web.Caching;

namespace easygenerator.Web.Mail
{
    public class MailSenderTask
    {
        private readonly MailSender _mailSender;
        private readonly IUnitOfWork _dataContext;
        private readonly IMailNotificationRepository _mailNotificationRepository;
        private readonly MailSettings _senderSettings;

        private static CacheItemRemovedCallback OnCacheRemove = null;
        private const string TaskName = "MailSenderTask";

        public MailSenderTask(IUnitOfWork unitOfWork, IMailNotificationRepository mailRepository, MailSender sender, MailSettings senderSettings)
        {
            _dataContext = unitOfWork;
            _mailSender = sender;
            _mailNotificationRepository = mailRepository;
            _senderSettings = senderSettings;
        }

        public void Start()
        {
            if (_senderSettings.MailSenderSettings.Enable)
            {
                AddMailSenderTask(_senderSettings.MailSenderSettings.Interval);
            }
        }

        private void AddMailSenderTask(int interval)
        {
            OnCacheRemove = new CacheItemRemovedCallback(CacheItemRemoved);
            HttpRuntime.Cache.Insert(TaskName, interval, null, DateTime.Now.AddSeconds(interval), Cache.NoSlidingExpiration, CacheItemPriority.NotRemovable, OnCacheRemove);
        }

        private void CacheItemRemoved(string k, object v, CacheItemRemovedReason r)
        {
            try
            {
                SendMailNotifications(_senderSettings.MailSenderSettings.BatchSize);
            }
            catch (Exception)
            {
                // log error
            }
            finally
            {
                AddMailSenderTask(Convert.ToInt32(v));
            }
        }

        private void SendMailNotifications(int batchSize)
        {
            var mailNotifications = _mailNotificationRepository.GetCollection(batchSize);
            if (mailNotifications != null)
            {
                foreach (var mailNotification in mailNotifications)
                {
                    if (_mailSender.Send(mailNotification))
                    {
                        _mailNotificationRepository.Remove(mailNotification);
                        _dataContext.Save();
                    }
                }
            }
        }
    }
}