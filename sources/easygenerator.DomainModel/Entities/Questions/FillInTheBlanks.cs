using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class FillInTheBlanks : Question
    {
        public FillInTheBlanks() { }

        public FillInTheBlanks(string title, string createdBy)
            : base(title, createdBy)
        {
            AnswersCollection = new Collection<BlankAnswer>();
        }

        protected internal virtual ICollection<BlankAnswer> AnswersCollection { get; set; }

        public IEnumerable<BlankAnswer> Answers
        {
            get { return AnswersCollection.AsEnumerable(); }
        }

        public virtual void UpdateAnswers(ICollection<BlankAnswer> answers, string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);

            foreach (var answer in AnswersCollection)
            {
                answer.Question = null;
            }
            AnswersCollection = answers;

            MarkAsModified(modifiedBy);
        }

        public void AddAnswer(BlankAnswer answer, string modifiedBy)
        {
            ThrowIfAnswerIsInvalid(answer);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            AnswersCollection.Add(answer);
            answer.Question = this;
            MarkAsModified(modifiedBy);
        }

        public override void UpdateContent(string content, string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Content = content;
            MarkAsModified(modifiedBy);

            RaiseEvent(new FillInTheBlankUpdatedEvent(this, AnswersCollection));
        }

        private void ThrowIfAnswerIsInvalid(BlankAnswer answer)
        {
            ArgumentValidation.ThrowIfNull(answer, "answer");
        }
    }
}
