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

        protected internal Objective(string title)
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

        public IEnumerable<Question> Questions
        {
            get
            {
                return _questions.AsEnumerable();
            }
        }

        public virtual Question AddQuestion(string title)
        {
            var question = new Question(title);

            _questions.Add(question);
            MarkAsModified();

            return question;
        }

        private void ThrowIfTitleIsInvalid(string title)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(title, "title");
            ArgumentValidation.ThrowIfLongerThan255(title, "title");
        }
    }
}
