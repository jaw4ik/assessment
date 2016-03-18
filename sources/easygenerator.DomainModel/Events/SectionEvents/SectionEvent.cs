using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.SectionEvents
{
    public abstract class SectionEvent : Event
    {
        public Section Section { get; private set; }

        protected SectionEvent(Section section)
        {
            ThrowIfSectionIsInvalid(section);

            Section = section;
        }

        private void ThrowIfSectionIsInvalid(Section section)
        {
            ArgumentValidation.ThrowIfNull(section, "section");
        }
    }
}
