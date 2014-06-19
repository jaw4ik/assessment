using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class Dropspot : Entity
    {
        protected internal Dropspot() { }

        public Dropspot(string createdBy)
            : base(createdBy)
        {

        }

        public string Text { get; set; }
        public int X { get; set; }
        public int Y { get; set; }

        public DragAndDropText Question { get; set; }
    }
}
