using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class Objective : Entity
    {
        protected internal Objective(string title, string createdBy)
            : base(createdBy)
        {
            ThrowIfTitleIsInvalid(title);
            Title = title;

            _questions = new Collection<Question>();
        }

        public string Title { get; private set; }

        public virtual void UpdateTitle(string title, string modifiedBy)
        {
            ThrowIfTitleIsInvalid(title);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Title = title;
            MarkAsModified(modifiedBy);
        }

        private readonly ICollection<Question> _questions;

        public virtual IEnumerable<Question> Questions
        {
            get
            {
                return _questions.AsEnumerable();
            }
        }

        public virtual void AddQuestion(Question question, string modifiedBy)
        {
            ThrowIfQuestionIsInvalid(question);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            _questions.Add(question);
            question.Objective = this;
            MarkAsModified(modifiedBy);
        }

        public virtual void RemoveQuestion(Question question, string modifiedBy)
        {
            ThrowIfQuestionIsInvalid(question);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            _questions.Remove(question);
            question.Objective = null;
            MarkAsModified(modifiedBy);
        }

        private void ThrowIfTitleIsInvalid(string title)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(title, "title");
            ArgumentValidation.ThrowIfLongerThan255(title, "title");
        }

        private void ThrowIfQuestionIsInvalid(Question question)
        {
            ArgumentValidation.ThrowIfNull(question, "question");
        }

        private void ThrowIfModifiedByIsInvalid(string modifiedBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(modifiedBy, "modifiedBy");
        }
    }
}
