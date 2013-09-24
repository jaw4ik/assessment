using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class Objective : Entity
    {
        protected internal Objective() { }

        protected internal Objective(string title )
        {
            ThrowIfTitleIsInvalid(title);
            Title = title;

            _questions = new Collection<Question>();
        }

        public string Title { get; private set; }

        public virtual void UpdateTitle(string title)
        {
            ThrowIfTitleIsInvalid(title);

            Title = title;
            MarkAsModified();
        }

        private readonly ICollection<Question> _questions;

        public virtual IEnumerable<Question> Questions
        {
            get
            {
                return _questions.AsEnumerable();
            }
        }

        public virtual void AddQuestion(Question question)
        {
            ThrowIfQuestionIsInvalid(question);

            _questions.Add(question);
            question.Objective = this;
            MarkAsModified();
        }

        public virtual void RemoveQuestion(Question question)
        {
            ThrowIfQuestionIsInvalid(question);

            _questions.Remove(question);
            question.Objective = null;
            MarkAsModified();
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

    }
}
