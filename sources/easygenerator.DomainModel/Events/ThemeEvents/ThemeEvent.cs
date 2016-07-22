using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Events.ThemeEvents
{
    public abstract class ThemeEvent : Event
    {
        public Theme Theme { get; private set; }

        protected ThemeEvent(Theme theme)
        {
            Theme = theme;
        }
    }
}
