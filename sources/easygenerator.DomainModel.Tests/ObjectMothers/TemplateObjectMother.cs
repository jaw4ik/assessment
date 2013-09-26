using easygenerator.DomainModel.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class TemplateObjectMother
    {
        private const string Name = "Default";
        private const string Image = "imageUrl";

        public static Template Create(string name = Name, string image = Image)
        {
            return new Template(name, image);
        }

        public static Template CreateWithImage(string image = Image)
        {
            return new Template(Name, image);
        }
    }
}
