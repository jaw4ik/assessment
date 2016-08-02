
using System;
using System.Collections.Generic;
using System.Linq;

namespace easygenerator.DomainModel.Entities
{
    internal static class OrderingUtils
    {
        public static string GetOrder<T>(ICollection<T> collection)
            where T : IIdentifiable
        {
            return collection.Count == 0 ? null : String.Join(",", collection.Select(i => i.Id).ToArray());
        }

        public static IList<T> OrderCollection<T>(IEnumerable<T> collection, string order)
            where T : IIdentifiable
        {
            if (order == null)
            {
                return collection.ToList();
            }

            var orderedIds = order.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).ToList();
            return collection.OrderBy(e => GetIndex(orderedIds, e)).ToList();
        }

        private static int GetIndex<T>(IList<string> orderedIds, T entity)
            where T : IIdentifiable
        {
            var index = orderedIds.IndexOf(entity.Id.ToString());
            return index > -1 ? index : orderedIds.Count;
        }
    }
}
