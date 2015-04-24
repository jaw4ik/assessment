using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.ObjectiveEvents
{
    public abstract class ObjectiveEvent : Event
    {
        public Objective Objective { get; private set; }

        protected ObjectiveEvent(Objective objective)
        {
            ThrowIfObjectiveIsInvalid(objective);

            Objective = objective;
        }

        private void ThrowIfObjectiveIsInvalid(Objective objective)
        {
            ArgumentValidation.ThrowIfNull(objective, "objective");
        }
    }
}
