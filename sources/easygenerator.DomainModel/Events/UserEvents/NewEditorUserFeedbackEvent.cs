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
        public string Message { get; private set; }

        public NewEditorUserFeedbackEvent(int rate, string message)
        {
            Rate = rate;
            Message = message;
        }
    }
}
