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

        public virtual SingleSelectImageAnswer CorrectAnswer { get; private set; }

        protected internal virtual Collection<SingleSelectImageAnswer> AnswerCollection { get; set; }
        public IEnumerable<SingleSelectImageAnswer> Answers
        {
            get { return AnswerCollection.AsEnumerable(); }
        }

        public virtual void AddAnswer(SingleSelectImageAnswer answer, string modifiedBy)
        {
            ThrowIfAnswerIsInvalid(answer);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            AnswerCollection.Add(answer);
            answer.Question = this;

            MarkAsModified(modifiedBy);
        }

        public virtual void RemoveAnswer(SingleSelectImageAnswer answer, string modifiedBy)
        {
            ThrowIfAnswerIsInvalid(answer);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            AnswerCollection.Remove(answer);

            if (answer == CorrectAnswer)
            {
                var firstAnswer = AnswerCollection.OrderBy(a => a.CreatedOn).FirstOrDefault();
                if (firstAnswer != null)
                {
                    CorrectAnswer = firstAnswer;
                }
            }

            answer.Question = null;

            MarkAsModified(modifiedBy);
        }

        public virtual void SetCorrectAnswer(SingleSelectImageAnswer answer, string modifiedBy)
        {
            ThrowIfAnswerIsInvalid(answer);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            CorrectAnswer = answer;

            MarkAsModified(modifiedBy);
        }

        private void ThrowIfAnswerIsInvalid(SingleSelectImageAnswer answer)
        {
            ArgumentValidation.ThrowIfNull(answer, "answer");
        }
    }
}
