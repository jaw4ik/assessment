using System.Collections.Generic;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.ObjectiveEvents
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
