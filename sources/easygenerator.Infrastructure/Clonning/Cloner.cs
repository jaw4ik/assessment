using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Reflection;
using System.Runtime.CompilerServices;

namespace easygenerator.Infrastructure.Clonning
{
    public class Cloner : ICloner
    {
        protected ConcurrentDictionary<Type, Delegate> callbacks;

        public Cloner()
        {
            callbacks = new ConcurrentDictionary<Type, Delegate>();
        }

        public virtual T Clone<T>(T obj, params object[] args)
        {
            var cloned = new Dictionary<object, object>(ReferenceComparer.Instance);
            return (T)InnerClone(obj, cloned, args);
        }

        protected virtual object InnerClone(object obj, IDictionary<object, object> cloned, params object[] args)
        {
            if (obj == null)
                return null;

            var type = obj.GetObjectType();
            if (!NeedsRecursiveClone(type))
                return obj;

            object clone;
            if (cloned.TryGetValue(obj, out clone))
                return clone;

            Delegate ex = callbacks.GetOrAdd(type, t => BuildTypeClone(t).Compile());
            return ex.DynamicInvoke(new[] { obj, cloned, args });
        }

        

        protected virtual bool NeedsRecursiveClone(Type type)
        {
            if (type.IsValueType)
                return false;
            if (type == typeof(string))
                return false;

            return true;
        }

        protected virtual List<Expression> GetCustomCloneExpressions(Type type, Expression target, Expression cloned, Expression source, Expression args)
        {
            return null;
        }

        protected virtual LambdaExpression BuildTypeClone(Type type)
        {
            var target = Expression.Variable(type, "target");
            var source = Expression.Parameter(type);
            var cloned = Expression.Parameter(typeof(IDictionary<object, object>));
            var args = Expression.Parameter(typeof(object[]));

            var vars = new ParameterExpression[] { target };

            var list = new List<Expression>();
            if (type.IsArray)
            {
                list.Add(GetArrayCloneExpression(type, source, target, cloned, args));
            }
            else
            {
                var customCloneExpression = GetCustomCloneExpressions(type, target, cloned, source, args);
                if (customCloneExpression != null)
                {
                    list.AddRange(customCloneExpression);
                }
                else
                {
                    list.Add(Expression.Assign(target, Expression.New(type)));
                    list.Add(Expression.Call(cloned, Methods.ClonedDic_Add, source, target));
                    foreach (var member in type.GetProperties())
                    {
                        if (!member.CanRead || !member.CanWrite || member.GetIndexParameters().Length > 0)
                            continue;
                        list.Add(GetPropertyCopyExpression(member, source, target, cloned, args));
                    }
                    if (typeof(IDictionary).IsAssignableFrom(type))
                    {
                        list.Add(GetDictionaryCopyExpression(type, source, target, cloned, args));
                    }
                    else if (typeof(IList).IsAssignableFrom(type))
                    {
                        list.Add(GetListCopyExpression(type, source, target, cloned, args));
                    }
                    else if (type.ImplementsInterface(typeof(ICollection<>)))
                    {
                        list.Add(GetGenericCollectionCopyExpression(type, source, target, cloned, args));
                    }
                    else if (type.ImplementsInterface(typeof(IEnumerable<>)) &&
                             type.HasMethod("Add", type.GetGenericInterfaceArgument(typeof(IEnumerable<>))))
                    {
                        list.Add(GetGenericEnumerableCopyExpression(type, source, target, cloned, args));
                    }
                    else if (typeof(IEnumerable).IsAssignableFrom(type) && type.HasMethod("Add", typeof(object)))
                    {
                        list.Add(GetNonGenericEnumerableCopyExpression(type, source, target, cloned, args));
                    }
                }
            }
            list.Add(target);
            Expression body = Expression.Block(type, vars, list);
            return Expression.Lambda(body, source, cloned, args);
        }


        protected virtual Expression GetPropertyCopyExpression(PropertyInfo member, Expression source, Expression target, Expression cloned, Expression args)
        {
            var memberType = member.PropertyType;
            Expression value = Expression.Property(source, member);
            if (NeedsRecursiveClone(memberType))
            {
                value = Expression.Call(Expression.Constant(this), Methods.Cloner_InnerClone, value, cloned, args);
                value = Expression.ConvertChecked(value, memberType);
            }

            return Expression.Assign(Expression.Property(target, member), value);
        }

        #region Enumerable

        protected virtual Expression GetNonGenericEnumerableCopyExpression(Type collectionType, Expression source, Expression target, Expression cloned, Expression args)
        {
            MethodInfo addMethod = collectionType.GetMethod("Add", new Type[] { typeof(object) });

            return GetEnumerableCopyExpression(collectionType, addMethod, typeof(object), source, target, cloned, args);
        }

        protected virtual Expression GetGenericEnumerableCopyExpression(Type collectionType, Expression source, Expression target, Expression cloned, Expression args)
        {
            var elementType = collectionType.GetGenericInterfaceArgument(typeof(IEnumerable<>));
            var addMethod = collectionType.GetMethod("Add", new Type[] { elementType });

            return GetEnumerableCopyExpression(collectionType, addMethod, elementType, source, target, cloned, args);
        }

        protected virtual Expression GetEnumerableCopyExpression(Type collectionType, MethodInfo addMethod, Type elementType,
            Expression source, Expression target, Expression cloned, Expression args)
        {
            var label = Expression.Label();
            var enumerator = Expression.Parameter(typeof(IEnumerator), "enumerator");
            var vars = new[] { enumerator };
            var loop = Expression.Block(vars,
                Expression.Assign(enumerator, Expression.Call(source, Methods.IEnumerable_GetEnumerator)),
                Expression.Loop(
                    Expression.IfThenElse(
                        Expression.IsTrue(Expression.Call(enumerator, Methods.IEnumerator_MoveNext)),
                        Expression.Call(target, addMethod, Expression.ConvertChecked(
                            Expression.Call(
                                Expression.Constant(this),
                                Methods.Cloner_InnerClone,
                                Expression.Property(enumerator, "Current"),
                                cloned,
                                args),
                            elementType)),
                        Expression.Break(label)
                    )
                ),
                Expression.Label(label)
            );

            return loop;
        }

        #endregion

        #region Generic collection

        protected virtual Expression GetGenericCollectionCopyExpression(Type type, ParameterExpression source, ParameterExpression target, ParameterExpression cloned, Expression args)
        {
            var elementType = type.GetInterface("ICollection`1").GetGenericArguments()[0];
            var method = Methods.Cloner_CloneGenericCollection.MakeGenericMethod(elementType);
            return Expression.Call(Expression.Constant(this), method, source, target, cloned, args);
        }

        protected virtual void CloneGenericCollection<T>(ICollection<T> source, ICollection<T> target, IDictionary<object, object> cloned, params object[] args)
        {
            foreach (T item in source)
            {
                T clonnedValue = (T)InnerClone(item, cloned, args);
                target.Add(clonnedValue);
            }
        }

        #endregion

        #region List

        protected virtual Expression GetListCopyExpression(Type type, ParameterExpression source, ParameterExpression target, ParameterExpression cloned, Expression args)
        {
            return Expression.Call(Expression.Constant(this), Methods.Cloner_CloneList, source, target, cloned, args);
        }

        protected virtual void CloneList(IList source, IList target, IDictionary<object, object> cloned, params object[] args)
        {
            foreach (object item in source)
            {
                object clonedValue = InnerClone(item, cloned, args);
                target.Add(clonedValue);
            }
        }

        #endregion

        #region Dictionary

        protected virtual Expression GetDictionaryCopyExpression(Type dictionaryType, Expression source, Expression target, Expression cloned, Expression args)
        {
            return Expression.Call(Expression.Constant(this), Methods.Cloner_CloneDictionary, source, target, cloned, args);
        }

        protected virtual void CloneDictionary(IDictionary source, IDictionary target, IDictionary<object, object> cloned, params object[] args)
        {
            foreach (var key in source.Keys)
            {
                object clonedKey = InnerClone(key, cloned, args);
                object clonedValue = InnerClone(source[key], cloned, args);
                target.Add(clonedKey, clonedValue);
            }
        }

        #endregion

        #region Array

        protected virtual Expression GetArrayCloneExpression(Type arrayType, Expression source, Expression target, Expression cloned, Expression args)
        {
            var elementType = arrayType.GetInterface("IEnumerable`1").GetGenericArguments()[0];
            var method = Methods.Cloner_CloneArray.MakeGenericMethod(elementType);
            var call = Expression.Call(Expression.Constant(this), method, source, cloned, args);
            return Expression.Assign(target, call);
        }

        protected virtual T[] CloneArray<T>(T[] array, IDictionary<object, object> cloned, params object[] args)
        {
            var result = new T[array.Length];
            cloned.Add(array.GetHashCode(), result);
            for (int i = 0; i < array.Length; i++)
            {
                var item = (T)InnerClone(array[i], cloned, args);
                result[i] = item;
            }
            return result;
        }

        #endregion

        #region Nested Types

        protected struct ReferenceComparer : IEqualityComparer<object>
        {
            public static readonly ReferenceComparer Instance = new ReferenceComparer();

            bool IEqualityComparer<object>.Equals(object x, object y)
            {
                return Object.ReferenceEquals(x, y);
            }

            int IEqualityComparer<object>.GetHashCode(object obj)
            {
                return RuntimeHelpers.GetHashCode(obj);
            }
        }

        protected static class Methods
        {
            public static MethodInfo Cloner_InnerClone = typeof(Cloner).GetMethod("InnerClone", BindingFlags.NonPublic | BindingFlags.Instance);
            public static MethodInfo Cloner_CloneArray = typeof(Cloner).GetMethod("CloneArray", BindingFlags.NonPublic | BindingFlags.Instance);
            public static MethodInfo Cloner_CloneDictionary = typeof(Cloner).GetMethod("CloneDictionary", BindingFlags.NonPublic | BindingFlags.Instance);
            public static MethodInfo Cloner_CloneList = typeof(Cloner).GetMethod("CloneList", BindingFlags.NonPublic | BindingFlags.Instance);
            public static MethodInfo Cloner_CloneGenericCollection = typeof(Cloner).GetMethod("CloneGenericCollection", BindingFlags.NonPublic | BindingFlags.Instance);
            public static MethodInfo IEnumerable_GetEnumerator = typeof(IEnumerable).GetMethod("GetEnumerator");
            public static MethodInfo IEnumerator_MoveNext = typeof(IEnumerator).GetMethod("MoveNext");
            public static MethodInfo ClonedDic_Add = typeof(IDictionary<object, object>).GetMethod("Add");
            public static MethodInfo PropertyInfo_SetValue = typeof(PropertyInfo).GetMethod("SetValue", new[] { typeof(object), typeof(object) });
        }

        #endregion
    }
}
