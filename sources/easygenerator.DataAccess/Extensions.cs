using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Data.Entity.ModelConfiguration.Configuration;
using System.Linq.Expressions;
using System.Reflection;


namespace easygenerator.DataAccess
{
    public static class Extensions
    {
        public static ManyNavigationPropertyConfiguration<T, U> HasMany<T, U>(this EntityTypeConfiguration<T> mapper, string propertyName)
            where T : class
            where U : class
        {
            Type type = typeof(T);
            ParameterExpression arg = Expression.Parameter(type, "x");
            Expression expr = arg;

            PropertyInfo pi = type.GetProperty(propertyName, BindingFlags.NonPublic | BindingFlags.Public | BindingFlags.Instance);
            expr = Expression.Property(expr, pi);

            LambdaExpression lambda = Expression.Lambda(expr, arg);

            var expression = (Expression<Func<T, ICollection<U>>>)lambda;
            return mapper.HasMany(expression);
        }
    }
}
