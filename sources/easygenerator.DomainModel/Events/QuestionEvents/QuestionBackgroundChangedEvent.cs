using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.QuestionEvents
{
    public class QuestionBackgroundChangedEvent: QuestionEvent
    {
        public string Background { get; private set; }

        public QuestionBackgroundChangedEvent(QuestionWithBackground question, string background)
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
