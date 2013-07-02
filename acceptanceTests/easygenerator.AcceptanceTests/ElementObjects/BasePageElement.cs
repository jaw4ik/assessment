using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.AcceptanceTests.LinkingModels
{
    public class BasePageElement<T> where T : BaseLinkinkModel, new()
    {
        public BasePageElement() { }
        protected T model = new T();
        public BasePageElement(T model)
        {
            this.model = model;
        }
    }
}
