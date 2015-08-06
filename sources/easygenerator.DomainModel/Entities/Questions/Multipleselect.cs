using easygenerator.DomainModel.Events.AnswerEvents;
using easygenerator.Infrastructure;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class Multipleselect : Question
    {
        public Multipleselect() { }

        public Multipleselect(string title, string createdBy)
            : base(title, createdBy)
        {
            AnswersCollection = new Collection<Answer>();
        }

        public Multipleselect(string title, string createdBy, Answer correctAnswer, Answer incorrectAnswer)
            : this(title, createdBy)
        {
            ThrowIfAnswerIsInvalid(correctAnswer);
            ThrowIfAnswerIsInvalid(incorrectAnswer);

            AnswersCollection.Add(correctAnswer);
            AnswersCollection.Add(incorrectAnswer);
        }

        protected internal virtual ICollection<Answer> AnswersCollection { get; set; }

        public IEnumerable<Answer> Answers
        {
            get { return AnswersCollection.AsEnumerable().OrderBy(i => i.CreatedOn); }
        }

        public virtual void AddAnswer(Answer answer, string modifiedBy)
        {
            ThrowIfAnswerIsInvalid(answer);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            AnswersCollection.Add(answer);
            answer.Question = this;
            MarkAsModified(modifiedBy);

            RaiseEvent(new AnswerCreatedEvent(answer));
        }

        public virtual void RemoveAnswer(Answer answer, string modifiedBy)
        {
            ThrowIfAnswerIsInvalid(answer);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            AnswersCollection.Remove(answer);
            answer.Question = null;
            MarkAsModified(modifiedBy);

            RaiseEvent(new AnswerDeletedEvent(this, answer));
        }

        protected void ThrowIfAnswerIsInvalid(Answer answer)
        {
            ArgumentValidation.ThrowIfNull(answer, "answer");
        }
    }
}
