using easygenerator.DomainModel.Events.ThemeEvents;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class Theme : Entity
    {
        protected internal Theme() { }

        protected internal Theme(Template template, string name, string settings, string createdBy)
            : base(createdBy)
        {
            ThrowIfTemplateIsInvalid(template);
            ThrowIfSettingsAreInvalid(settings);
            ThrowIfNameIsInvalid(name);

            Template = template;
            Name = name;
            Settings = settings;
        }

        public string Name { get; private set; }
        public string Settings { get; private set; }

        public virtual Template Template { get; internal set; }

        public virtual void Update(string settings, string modifiedBy)
        {
            ThrowIfSettingsAreInvalid(settings);

            Settings = settings;

            MarkAsModified(modifiedBy);

            RaiseEvent(new ThemeUpdatedEvent(this));
        }

        #region Guard methods

        private static void ThrowIfSettingsAreInvalid(string settings)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(settings, nameof(settings));
        }

        private static void ThrowIfTemplateIsInvalid(Template template)
        {
            ArgumentValidation.ThrowIfNull(template, nameof(template));
        }

        private static void ThrowIfNameIsInvalid(string name)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(name, nameof(name));
            ArgumentValidation.ThrowIfLongerThan255(name, nameof(name));
        }

        #endregion
    }
}
