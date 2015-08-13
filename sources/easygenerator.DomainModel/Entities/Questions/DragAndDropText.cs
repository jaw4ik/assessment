using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.DomainModel.Events.QuestionEvents.DragAndDropEvents;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class DragAndDropText : QuestionWithBackground
    {
        public DragAndDropText() { }

        public DragAndDropText(string title, string createdBy)
            : base(title, createdBy)
        {
            DropspotsCollection = new Collection<Dropspot>();
        }

        protected internal virtual Collection<Dropspot> DropspotsCollection { get; set; }
        public IEnumerable<Dropspot> Dropspots
        {
            get { return DropspotsCollection.AsEnumerable().OrderBy(i => i.CreatedOn); }
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

        private void ThrowIfDropspotIsInvalid(Dropspot dropspot)
        {
            ArgumentValidation.ThrowIfNull(dropspot, "dropspot");
        }
    }
}
