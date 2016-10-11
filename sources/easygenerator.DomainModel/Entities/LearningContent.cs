using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events.LearningContentEvents;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class LearningContent : Entity
    {
        protected internal LearningContent() { }

        protected internal LearningContent(string text, string createdBy)
            : base(createdBy)
        {
            ThrowIfTextIsInvalid(text);

            Text = text;
        }

        protected internal LearningContent(string text, string createdBy, decimal position) :
            this(text, createdBy)
        {
            ThrowIfPositionIsInvalid(position);

            Position = position;
        }

        public string Text { get; private set; }

        public virtual Question Question { get; internal set; }

        public decimal Position { get; private set; }

        public virtual void UpdateText(string text, string modifiedBy)
        {
            ThrowIfTextIsInvalid(text);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Text = text;
            MarkAsModified(modifiedBy);

            RaiseEvent(new LearningContentUpdatedEvent(this));
        }

        public virtual void UpdatePosition(decimal position, string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);
            ThrowIfPositionIsInvalid(position);

            Position = position;
            MarkAsModified(modifiedBy);

            RaiseEvent(new LearningContentUpdatedEvent(this));
        }

        private void ThrowIfTextIsInvalid(string text)
        {
            ArgumentValidation.ThrowIfNull(text, "text");
        }

        private void ThrowIfPositionIsInvalid(decimal position)
        {
            // due to the way how this value is stored in DB: decimal(18, 15).
            const decimal maxAllowedPosition = 999;
            const decimal minAllowedPosition = -999;
            //
            ArgumentValidation.ThrowIfNumberIsOutOfRange(position, minAllowedPosition, maxAllowedPosition, nameof(position));
        }
    }
}
