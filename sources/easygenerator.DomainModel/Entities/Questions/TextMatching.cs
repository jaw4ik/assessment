using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
        }

        public virtual void RemoveAnswer(TextMatchingAnswer answer, string modifiedBy)
        {
            ThrowIfAnswerIsInvalid(answer);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            AnswersCollection.Remove(answer);
            answer.Question = null;

            MarkAsModified(modifiedBy);
        }

        private void ThrowIfAnswerIsInvalid(TextMatchingAnswer answer)
        {
            ArgumentValidation.ThrowIfNull(answer, "answer");
        }
    }
}
