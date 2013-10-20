﻿using easygenerator.DomainModel.Entities;
using System;
using System.Collections.Generic;
using System.Net.Mail;
using easygenerator.Web.Components;

namespace easygenerator.Web.Mail
{
    public interface IMailSender
    {
        bool Send(MailNotification mail);

        bool Send(string body, string subject, string fromAddress, string toAddresses, string ccAddresses = null,
            string bccAddresses = null);

        bool Send(MailMessage msg);
    }

    public class MailSender : IMailSender
    {
        private const char AddressesSeparator = ';';

        public bool Send(MailNotification mail)
        {
            return Send(mail.Body, mail.Subject, mail.FromEmailAddress, mail.ToEmailAddresses, mail.CCEmailAddresses, mail.BCCEmailAddresses);
        }

        public bool Send(string body, string subject, string fromAddress, string toAddresses, string ccAddresses = null, string bccAddresses = null)
        {
            MailMessage message = new MailMessage();
            foreach (var ccEmail in SplitEmailAddresses(ccAddresses))
            {
                message.CC.Add(new MailAddress(ccEmail));
            }
            foreach (var bccEmail in SplitEmailAddresses(bccAddresses))
            {
                message.Bcc.Add(new MailAddress(bccEmail));
            }
            foreach (var toEmail in SplitEmailAddresses(toAddresses))
            {
                message.To.Add(new MailAddress(toEmail));
            }

            message.Subject = subject;
            message.IsBodyHtml = true;
            message.Body = body;
            message.From = new MailAddress(fromAddress);

            return Send(message);
        }

        public bool Send(MailMessage msg)
        {
            var smtp = new SmtpClient();
            try
            {
                smtp.Send(msg);
            }
            catch (Exception exception)
            {
                ElmahLog.LogException(exception);
                return false;
            }
            return true;
        }

        private IEnumerable<string> SplitEmailAddresses(string emailAddresses)
        {
            return !String.IsNullOrEmpty(emailAddresses) ? emailAddresses.Split(AddressesSeparator) : new string[] { };
        }
    }
}