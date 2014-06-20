using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.QuestionEvents.DragAnsDropEvents
{
    public class BackgroundChangedEvent: QuestionEvent
    {
        public string Background { get; private set; }

        public BackgroundChangedEvent(Question question, string background)
            : base(question)
        {
            ThrowIfBackgroundIsInvalid(background);

            Background = background;
        }

        private void ThrowIfBackgroundIsInvalid(string background)
        {
            ArgumentValidation.ThrowIfNull(background, "background");
        }
    }
}
