using System.Collections.Generic;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.SectionEvents
{
    public class QuestionsDeletedEvent : SectionEvent
    {
        public ICollection<Question> Questions { get; private set; }

        public QuestionsDeletedEvent(Section section, ICollection<Question> questions)
            : base(section)
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
