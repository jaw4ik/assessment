using System.Web.Mvc;

namespace easygenerator.Web.Components.ModelBinding
{
    public class DateTimeModelBinder : IModelBinder
    {
        public object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            var value = bindingContext.ValueProvider.GetValue(bindingContext.ModelName);
            var submittedValue = value == null ? null : value.AttemptedValue;

            if (string.IsNullOrEmpty(submittedValue))
            {
                return null;
            }

            long ticks;
            if (long.TryParse(submittedValue, out ticks))
            {
                return new System.DateTime(ticks);
            }

            System.DateTime date;
            if (!System.DateTime.TryParse(submittedValue, out date))
            {
                return null;
            }

            return bindingContext.ModelMetadata.Model;
        }
    }
}