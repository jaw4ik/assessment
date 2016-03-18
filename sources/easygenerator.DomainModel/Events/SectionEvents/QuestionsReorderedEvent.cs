using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.SectionEvents
{
    public class QuestionsReorderedEvent : SectionEvent
    {
        public QuestionsReorderedEvent(Section section) : base(section)
        {
            
        }
    }
}
