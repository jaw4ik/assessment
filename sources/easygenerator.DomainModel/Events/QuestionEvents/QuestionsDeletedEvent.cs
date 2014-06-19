using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events.ObjectiveEvents;
using easygenerator.Infrastructure;
using System.Collections.Generic;

namespace easygenerator.DomainModel.Events.QuestionEvents
{
    public class QuestionsDeletedEvent : ObjectiveEvent
    {
        public ICollection<Question> Questions { get; private set; }

        public QuestionsDeletedEvent(Objective objective, ICollection<Question> questions)
            : base(objective)
        {
            ThrowIfQuestionsIsInvalid(questions);

            Questions = questions;
        }

        private void ThrowIfQuestionsIsInvalid(ICollection<Question> questions)
        {
            ArgumentValidation.ThrowIfNull(questions, "questions");
        }
    }
}
