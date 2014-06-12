﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
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
