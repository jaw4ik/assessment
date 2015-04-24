using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Events.QuestionEvents.DragAndDropEvents;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class Dropspot : Entity
    {
        protected internal Dropspot() { }

        public Dropspot(string text, int x, int y, string createdBy)
            : base(createdBy)
        {
            ThrowIfTextIsInvalid(text);

            Text = text;
            X = x;
            Y = y;
        }

        public string Text { get; private set; }
        public int X { get; private set; }
        public int Y { get; private set; }

        public virtual DragAndDropText Question { get; internal set; }

        public virtual void ChangeText(string text, string modifiedBy)
        {
            ThrowIfTextIsInvalid(text);
            ThrowIfModifiedByIsInvalid(modifiedBy);

            Text = text;

            MarkAsModified(modifiedBy);

            RaiseEvent(new DropspotTextChangedEvent(this));
        }

        public virtual void ChangePosition(int x, int y, string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);
            X = x; Y = y;
            MarkAsModified(modifiedBy);

            RaiseEvent(new DropspotPositionChangedEvent(this));
        }


        private void ThrowIfTextIsInvalid(string text)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(text, "text");
        }
    }
}
