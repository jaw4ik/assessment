using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.DomainModel.Events.QuestionEvents.DragAnsDropEvents;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class DragAndDropText : Question
    {
        public DragAndDropText() { }

        public DragAndDropText(string title, string createdBy)
            : base(title, createdBy)
        {
            DropspotsCollection = new Collection<Dropspot>();
        }

        public string Background { get; private set; }

        protected internal virtual Collection<Dropspot> DropspotsCollection { get; set; }
        public IEnumerable<Dropspot> Dropspots
        {
            get { return DropspotsCollection.AsEnumerable(); }
        }

        public virtual void ChangeBackground(string background, string modifiedBy)
        {
            ThrowIfBackgroundIsInvalid(background);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Background = background;
            MarkAsModified(modifiedBy);

            RaiseEvent(new BackgroundChangedEvent(this, background));
        }

        public virtual void AddDropspot(Dropspot dropspot, string modifiedBy)
        {
            ThrowIfDropspotIsInvalid(dropspot);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            DropspotsCollection.Add(dropspot);
            dropspot.Question = this;

            MarkAsModified(modifiedBy);

            RaiseEvent(new DropspotCreatedEvent(dropspot));
        }

        public virtual void RemoveDropspot(Dropspot dropspot, string modifiedBy)
        {
            ThrowIfDropspotIsInvalid(dropspot);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            DropspotsCollection.Remove(dropspot);
            dropspot.Question = null;

            MarkAsModified(modifiedBy);

            RaiseEvent(new DropspotDeletedEvent(this, dropspot));
        }

        private void ThrowIfBackgroundIsInvalid(string background)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(background, "background");
        }

        private void ThrowIfDropspotIsInvalid(Dropspot dropspot)
        {
            ArgumentValidation.ThrowIfNull(dropspot, "dropspot");
        }
    }
}
