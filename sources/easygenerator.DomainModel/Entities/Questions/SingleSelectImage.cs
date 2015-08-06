using easygenerator.DomainModel.Events.QuestionEvents.SingleSelectImageEvents;
using easygenerator.Infrastructure;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class SingleSelectImage : Question
    {
        public SingleSelectImage() { }

        public SingleSelectImage(string title, string createdBy)
            : base(title, createdBy)
        {
            AnswerCollection = new Collection<SingleSelectImageAnswer>();
        }

        public SingleSelectImage(string title, string createdBy, SingleSelectImageAnswer correctAnswer, SingleSelectImageAnswer incorrectAnswer)
            : this(title, createdBy)
        {
            ThrowIfAnswerIsInvalid(correctAnswer);
            ThrowIfAnswerIsInvalid(incorrectAnswer);

            correctAnswer.IsCorrect = true;
            AnswerCollection.Add(correctAnswer);
            AnswerCollection.Add(incorrectAnswer);
        }

        public virtual SingleSelectImageAnswer CorrectAnswer
        {
            get { return Answers.FirstOrDefault(e => e.IsCorrect); }
        }

        protected internal virtual Collection<SingleSelectImageAnswer> AnswerCollection { get; set; }
        public IEnumerable<SingleSelectImageAnswer> Answers
        {
            get { return AnswerCollection.AsEnumerable().OrderBy(i => i.CreatedOn); }
        }

        public virtual void AddAnswer(SingleSelectImageAnswer answer, string modifiedBy)
        {
            ThrowIfAnswerIsInvalid(answer);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            AnswerCollection.Add(answer);
            answer.Question = this;

            MarkAsModified(modifiedBy);

            RaiseEvent(new SingleSelectImageAnswerCreatedEvent(answer));
        }

        public virtual void RemoveAnswer(SingleSelectImageAnswer answer, string modifiedBy)
        {
            ThrowIfAnswerIsInvalid(answer);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            if (!AnswerCollection.Contains(answer))
                return;

            AnswerCollection.Remove(answer);
            if (answer.IsCorrect)
            {
                var firstAnswer = AnswerCollection.OrderBy(a => a.CreatedOn).FirstOrDefault();
                if (firstAnswer != null)
                {
                    SetCorrectAnswer(firstAnswer);
                }
            }

            answer.Question = null;

            MarkAsModified(modifiedBy);

            RaiseEvent(new SingleSelectImageAnswerDeletedEvent(answer, this));
        }

        public virtual void SetCorrectAnswer(SingleSelectImageAnswer answer, string modifiedBy)
        {
            ThrowIfAnswerIsInvalid(answer);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            SetCorrectAnswer(answer);

            MarkAsModified(modifiedBy);

            RaiseEvent(new SingleSelectImageCorrectAnswerChangedEvent(answer));
        }

        private void SetCorrectAnswer(SingleSelectImageAnswer answer)
        {
            foreach (var item in Answers)
            {
                item.IsCorrect = item == answer;
            }
        }

        private void ThrowIfAnswerIsInvalid(SingleSelectImageAnswer answer)
        {
            ArgumentValidation.ThrowIfNull(answer, "answer");
        }
    }
}
