﻿using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class Question : Entity
    {
        protected internal Question(string title, string createdBy)
            : base(createdBy)
        {
            ThrowIfTitleIsInvalid(title);

            Title = title;

            _answers = new Collection<Answer>();
            _explanations = new Collection<Explanation>();
        }

        public string Title { get; private set; }

        public Objective Objective { get; internal set; }

        public virtual void UpdateTitle(string title, string modifiedBy)
        {
            ThrowIfTitleIsInvalid(title);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Title = title;
            MarkAsModified(modifiedBy);
        }

        private readonly ICollection<Answer> _answers;

        public IEnumerable<Answer> Answers
        {
            get { return _answers.AsEnumerable(); }
        }

        public void AddAnswer(Answer answer, string modifiedBy)
        {
            ThrowIfAnswerIsInvalid(answer);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            _answers.Add(answer);
            answer.Question = this;
            MarkAsModified(modifiedBy);
        }

        public void RemoveAnswer(Answer answer, string modifiedBy)
        {
            ThrowIfAnswerIsInvalid(answer);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            _answers.Remove(answer);
            answer.Question = null;
            MarkAsModified(modifiedBy);
        }

        private readonly ICollection<Explanation> _explanations;

        public IEnumerable<Explanation> Explanations
        {
            get { return _explanations.AsEnumerable(); }
        }

        public void AddExplanation(Explanation explanation, string modifiedBy)
        {
            ThrowIfExplanationIsInvalid(explanation);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            _explanations.Add(explanation);
            explanation.Question = this;
            MarkAsModified(modifiedBy);
        }

        public void RemoveExplanation(Explanation explanation, string modifiedBy)
        {
            ThrowIfExplanationIsInvalid(explanation);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            _explanations.Remove(explanation);
            explanation.Question = null;
            MarkAsModified(modifiedBy);
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

        private void ThrowIfModifiedByIsInvalid(string modifiedBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(modifiedBy, "modifiedBy");
        }
    }
}
