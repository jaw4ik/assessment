﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.SectionEvents
{
    public class SectionImageUrlUpdatedEvent : SectionEvent
    {
        public SectionImageUrlUpdatedEvent(Section section) : base(section)
        {

        }
    }
}