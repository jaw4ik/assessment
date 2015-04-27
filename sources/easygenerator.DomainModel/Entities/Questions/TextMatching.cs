using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.DomainModel.Events.QuestionEvents.TextMatchingEvents;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class TextMatching : Question
    {
        public TextMatching() { }

        public TextMatching(string title, string createdBy)
            : base(title, createdBy)
        {
            AnswersCollection = new Collection<TextMatchingAnswer>();
        }

        public TextMatching(string title, string createdBy, TextMatchingAnswer questionAnswer1, TextMatchingAnswer questionAnswer2)
            : this(title, createdBy)
        {
            ThrowIfAnswerIsInvalid(questionAnswer1);
            ThrowIfAnswerIsInvalid(questionAnswer2);

            AnswersCollection.Add(questionAnswer1);
            AnswersCollection.Add(questionAnswer2);
        }

        protected internal virtual Collection<TextMatchingAnswer> AnswersCollection { get; set; }
        public IEnumerable<TextMatchingAnswer> Answers
        {
            get { return AnswersCollection.AsEnumerable(); }
        }

        public virtual void AddAnswer(TextMatchingAnswer answer, string modifiedBy)
        {
            ThrowIfAnswerIsInvalid(answer);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            AnswersCollection.Add(answer);
            answer.Question = this;

            MarkAsModified(modifiedBy);

            RaiseEvent(new TextMatchingAnswerCreatedEvent(answer));
        }

        public virtual void RemoveAnswer(TextMatchingAnswer answer, string modifiedBy)
        {
            ThrowIfAnswerIsInvalid(answer);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            AnswersCollection.Remove(answer);
            answer.Question = null;

            MarkAsModified(modifiedBy);

            RaiseEvent(new TextMatchingAnswerDeletedEvent(this, answer));
        }

        private void ThrowIfAnswerIsInvalid(TextMatchingAnswer answer)
        {
            ArgumentValidation.ThrowIfNull(answer, "answer");
        }
    }
}
