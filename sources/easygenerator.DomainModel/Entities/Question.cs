using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class Question : Entity
    {
        protected internal Question() { }

        protected internal Question(string title)
        {
            ThrowIfTitleIsInvalid(title);

            Title = title;

            _answers = new Collection<Answer>();
            _explanations = new Collection<Explanation>();
        }

        public string Title { get; private set; }

        public Objective Objective { get; internal set; }

        public virtual void UpdateTitle(string title)
        {
            ThrowIfTitleIsInvalid(title);

            Title = title;
            MarkAsModified();
        }

        private readonly ICollection<Answer> _answers;

        public IEnumerable<Answer> Answers
        {
            get { return _answers.AsEnumerable(); }
        }

        public void AddAnswer(Answer answer)
        {
            ThrowIfAnswerIsInvalid(answer);

            _answers.Add(answer);
            answer.Question = this;
            MarkAsModified();
        }

        public void RemoveAnswer(Answer answer)
        {
            ThrowIfAnswerIsInvalid(answer);

            _answers.Remove(answer);
            answer.Question = null;
            MarkAsModified();
        }

        private readonly ICollection<Explanation> _explanations;

        public IEnumerable<Explanation> Explanations
        {
            get { return _explanations.AsEnumerable(); }
        }

        public void AddExplanation(Explanation explanation)
        {
            ThrowIfExplanationIsInvalid(explanation);

            _explanations.Add(explanation);
            explanation.Question = this;
            MarkAsModified();
        }

        public void RemoveExplanation(Explanation explanation)
        {
            ThrowIfExplanationIsInvalid(explanation);

            _explanations.Remove(explanation);
            explanation.Question = null;
            MarkAsModified();
        }

        private void ThrowIfTitleIsInvalid(string title)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(title, "title");
            ArgumentValidation.ThrowIfLongerThan255(title, "title");
        }

        private void ThrowIfAnswerIsInvalid(Answer answer)
        {
            ArgumentValidation.ThrowIfNull(answer, "answer");
        }

        private void ThrowIfExplanationIsInvalid(Explanation explanation)
        {
            ArgumentValidation.ThrowIfNull(explanation, "explanation");
        }
    }
}
