using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.DomainModel.Events.QuestionEvents.HotSpotEvents;
using easygenerator.Infrastructure;
using BackgroundChangedEvent = easygenerator.DomainModel.Events.QuestionEvents;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class HotSpot : QuestionWithBackground
    {
        public HotSpot() { }

        public HotSpot(string title, string createdBy)
            : base(title, createdBy)
        {
            IsMultiple = false;
            HotSpotPolygonsCollection = new Collection<HotSpotPolygon>();
        }

        public bool IsMultiple { get; private set; }

        protected internal virtual Collection<HotSpotPolygon> HotSpotPolygonsCollection { get; set; }
        public IEnumerable<HotSpotPolygon> HotSpotPolygons
        {
            get { return HotSpotPolygonsCollection.AsEnumerable(); }
        }

        public virtual void AddHotSpotPolygon(HotSpotPolygon hotSpotPolygon, string modifiedBy)
        {
            ThrowIfHotSpotPolygonIsInvalid(hotSpotPolygon);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            HotSpotPolygonsCollection.Add(hotSpotPolygon);
            hotSpotPolygon.Question = this;

            MarkAsModified(modifiedBy);

            RaiseEvent(new HotSpotPolygonCreatedEvent(hotSpotPolygon));
        }

        public virtual void RemoveHotSpotPolygon(HotSpotPolygon hotSpotPolygon, string modifiedBy)
        {
            ThrowIfHotSpotPolygonIsInvalid(hotSpotPolygon);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            HotSpotPolygonsCollection.Remove(hotSpotPolygon);
            hotSpotPolygon.Question = null;

            MarkAsModified(modifiedBy);

            RaiseEvent(new HotSpotPolygonDeletedEvent(this, hotSpotPolygon));
        }

        public virtual void ChangeType(bool isMultiple, string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);
            MarkAsModified(modifiedBy);

            IsMultiple = isMultiple;
            RaiseEvent(new HotSpotIsMultipleChangedEvent(this, isMultiple));
        }

        private void ThrowIfHotSpotPolygonIsInvalid(HotSpotPolygon hotSpotPolygon)
        {
            ArgumentValidation.ThrowIfNull(hotSpotPolygon, "hotSpotPolygon");
        }
    }
}
