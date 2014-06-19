﻿using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.Infrastructure;

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


        protected internal virtual ICollection<Answer> AnswersCollection { get; set; }

        public IEnumerable<Answer> Answers
        {
            get { return AnswersCollection.AsEnumerable(); }
        }

        public virtual void AddAnswer(Answer answer, string modifiedBy)
        {
            ThrowIfAnswerIsInvalid(answer);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            AnswersCollection.Add(answer);
            answer.Question = this;
            MarkAsModified(modifiedBy);
        }

        public virtual void RemoveAnswer(Answer answer, string modifiedBy)
        {
            ThrowIfAnswerIsInvalid(answer);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            AnswersCollection.Remove(answer);
            answer.Question = null;
            MarkAsModified(modifiedBy);
        }

        private void ThrowIfAnswerIsInvalid(Answer answer)
        {
            ArgumentValidation.ThrowIfNull(answer, "answer");
        }
    }
}
