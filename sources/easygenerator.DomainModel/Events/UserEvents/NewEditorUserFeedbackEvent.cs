using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.UserEvents
{
    public class NewEditorUserFeedbackEvent
    {
        public int Rate { get; private set; }
        public string UserEmail { get; private set; }
        public string Message { get; private set; }

        public NewEditorUserFeedbackEvent(string userEmail, int rate, string message)
        {
            UserEmail = userEmail;
            Rate = rate;
            Message = message;
        }
    }
}
