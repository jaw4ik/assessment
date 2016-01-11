using System;
using System.Web.Mvc;

namespace easygenerator.Web.Components.ModelBinding
{
    public class DateTimeModelBinder : IModelBinder
    {
        public object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            var value = bindingContext.ValueProvider.GetValue(bindingContext.ModelName);
            var submittedValue = value?.AttemptedValue;

            if (string.IsNullOrEmpty(submittedValue))
            {
                return null;
            }

            long ticks;
            if (long.TryParse(submittedValue, out ticks))
            {
                return new DateTime(ticks);
            }

            DateTime date;
            if (!DateTime.TryParse(submittedValue, out date))
            {
                return null;
            }

            return date.ToUniversalTime();
        }
    }
}