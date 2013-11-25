using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events
{
    public class UserFeedbackEvent
    {
        public string Email { get; private set; }
        public  string Message { get; private set; }

        public UserFeedbackEvent(string email, string message)
        {
            ThrowIfFeedbackMessageIsInvalid(message);

            Email = email;
            Message = message;
        }

        private void ThrowIfFeedbackMessageIsInvalid(string message)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(message, "feedback message");
        }
    }
}
