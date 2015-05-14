using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.Web.Import.Presentation.Model
{
    public class Presentation
    {
        public Presentation()
        {
            Slides = new List<Slide>();
        }

        public List<Slide> Slides { get; private set; }

    }
}
