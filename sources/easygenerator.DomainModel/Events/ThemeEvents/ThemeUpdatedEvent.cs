using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.ThemeEvents
{
    public class ThemeUpdatedEvent : ThemeEvent
    {
        public ThemeUpdatedEvent(Theme theme)
            :base(theme)
        {
        }
    }
}
