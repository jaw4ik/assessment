using System;
using System.CodeDom;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Events.QuestionEvents.HotSpotEvents;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class HotSpotPolygon : Entity
    {
        protected internal HotSpotPolygon() { }

        public HotSpotPolygon(string points, string createdBy)
            : base(createdBy)
        {
            ThrowIfPointsIsInvalid(points);
            Points = points;
        }

        public virtual HotSpot Question { get; internal set; }

        public string Points { get; internal set; }

        public virtual void Update(string points, string modifiedBy)
        {
            ThrowIfPointsIsInvalid(points);
            ThrowIfModifiedByIsInvalid(modifiedBy);
            Points = points;

            MarkAsModified(modifiedBy);

            RaiseEvent(new HotSpotPolygonUpdatedEvent(this));
        }

        private void ThrowIfPointsIsInvalid(string points)
        {
            ArgumentValidation.ThrowIfNotValidJsonFormat<List<Point>>(points, "points");
        }
    }

    public class Point
    {
        public int X { get; set; }
        public int Y { get; set; }
    }
}
