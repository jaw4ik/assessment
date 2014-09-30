﻿using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Events.AnswerEvents
{
    public class AnswerCorrectnessUpdatedEvent : AnswerEvent
    {
        public AnswerCorrectnessUpdatedEvent(Answer answer)
            : base(answer)
        {

        }
    }
}
