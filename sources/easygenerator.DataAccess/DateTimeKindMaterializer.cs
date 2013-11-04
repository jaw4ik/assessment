using System;
using System.Linq;
using easygenerator.Infrastructure;

namespace easygenerator.DataAccess
{
    public static class DateTimeKindMaterializer
    {
        public static void Apply(object entity, DateTimeKind kind)
        {
            ArgumentValidation.ThrowIfNull(entity, "entity");

            var properties =
                entity.GetType()
                    .GetProperties()
                    .Where(i => i.PropertyType == typeof(DateTime) || i.PropertyType == typeof(DateTime?));

            foreach (var property in properties)
            {
                var data = property.PropertyType == typeof(DateTime)
                    ? (DateTime)property.GetValue(entity)
                    : (DateTime?)property.GetValue(entity);

                if (data == null)
                {
                    continue;
                }

                property.SetValue(entity, DateTime.SpecifyKind(data.Value, kind));
            }
        }
    }
}
