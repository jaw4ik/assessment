using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class Experience : Entity
    {
        protected internal Experience() { }

        protected internal Experience(string title)
        {
            ThrowIfTitleIsInvalid(title);
            Title = title;
        }

        public string Title { get; private set; }

        private void ThrowIfTitleIsInvalid(string title)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(title, "title");
            ArgumentValidation.ThrowIfLongerThan255(title, "title");
        }
    }
}
