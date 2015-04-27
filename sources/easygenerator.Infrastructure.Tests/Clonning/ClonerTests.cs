using easygenerator.Infrastructure.Clonning;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections;
using System.Collections.Generic;

namespace easygenerator.Infrastructure.Tests.Clonning
{
    [TestClass]
    public class ClonerTest
    {
        private ICloner _cloner;

        [TestInitialize]
        public void Initialize()
        {
            _cloner = new Cloner();
        }

        [TestMethod]
        public void ClonePropertiesTest()
        {
            TestClass toClone = CreateTestClass();
            TestClass cloned = Clone(toClone);

            CheckClonedObject(toClone, cloned);
        }

        [TestMethod]
        public void CloneObjectGraphTest()
        {
            TestClass toClone = CreateTestClass();
            TestClass clone1 = Clone(toClone);
            toClone.Property1 = toClone.Property;
            TestClass clone2 = Clone(toClone);

            clone1.Property.Should().NotBe(clone1.Property1);
            clone2.Property.Should().Be(clone2.Property1);
        }

        [TestMethod]
        public void CloneArrayTest()
        {
            TestClass[] toClone = new TestClass[] { CreateTestClass(), CreateTestClass() };
            TestClass[] cloned = Clone(toClone);

            toClone.Length.Should().Be(cloned.Length);
            CheckClonedObject(toClone[0], cloned[0]);
        }

        [TestMethod]
        public void CloneDictionaryTest()
        {
            Hashtable dictionary = new Hashtable();
            dictionary.Add(CreateTestClass(), CreateTestClass());

            Hashtable clonedDictionary = CloneInContainer(dictionary);

            CheckClonedEnumerable(dictionary.Keys, clonedDictionary.Keys);
            CheckClonedEnumerable(dictionary.Values, clonedDictionary.Values);
        }

        [TestMethod]
        public void CloneListTest()
        {
            ArrayList list = new ArrayList() { CreateTestClass(), CreateTestClass() };
            ArrayList clonedList = CloneInContainer(list);

            CheckClonedEnumerable(list, clonedList);
        }

        [TestMethod]
        public void CloneCollectionTest()
        {
            ICollection<TestClass> collection = new HashSet<TestClass>() { CreateTestClass(), CreateTestClass() };
            ICollection<TestClass> clonedCollection = CloneInContainer(collection);

            CheckClonedEnumerable(collection, clonedCollection);
        }

        [TestMethod]
        public void CloneGenericEnumerableTest()
        {
            GenericEnumerable toClone = new GenericEnumerable() { CreateTestClass(), CreateTestClass() };
            GenericEnumerable cloned = CloneInContainer(toClone);

            CheckClonedEnumerable(toClone, cloned);
        }

        [TestMethod]
        public void CloneNonGenericEnumerableTest()
        {
            NonGenericEnumerable toClone = new NonGenericEnumerable() { CreateTestClass(), CreateTestClass() };
            NonGenericEnumerable cloned = CloneInContainer(toClone);

            CheckClonedEnumerable(toClone, cloned);
        }

        #region Helper functions

        private void CheckClonedObject(TestClass toClone, TestClass cloned)
        {
            toClone.Should().NotBe(cloned);
            toClone.Property.Should().NotBe(cloned.Property);
            toClone.Property1.Should().NotBe(cloned.Property1);
            toClone.TestStringValue.Should().Be(cloned.TestStringValue);
        }

        private void CheckClonedEnumerable(IEnumerable toClone, IEnumerable cloned)
        {
            toClone.Should().NotBeSameAs(cloned);

            IEnumerator enumerator1 = toClone.GetEnumerator();
            IEnumerator enumerator2 = cloned.GetEnumerator();

            bool hasValues = true;

            while (hasValues)
            {
                hasValues = enumerator1.MoveNext();
                (hasValues ^ enumerator2.MoveNext()).Should().Be(false);

                if (hasValues)
                {
                    CheckClonedObject((TestClass)enumerator1.Current, (TestClass)enumerator2.Current);
                }
            }
        }

        private TestClass CreateTestClass()
        {
            TestClass result = new TestClass();
            result.TestStringValue = Guid.NewGuid().ToString();
            result.Property = new SimpleTestClass();
            result.Property1 = new SimpleTestClass();

            return result;
        }

        private T CloneInContainer<T>(T item)
        {
            ContainerTestClass container = new ContainerTestClass();
            container.Property = item;
            return (T)Clone(container).Property;
        }

        private T Clone<T>(T item)
        {
            return (T)_cloner.Clone(item);
        }

        #endregion

        #region Helper classes

        class ContainerTestClass
        {
            public object Property { get; set; }
        }

        class GenericEnumerable : IEnumerable<TestClass>
        {
            List<TestClass> items = new List<TestClass>();

            public void Add(TestClass item)
            {
                items.Add(item);
            }

            public IEnumerator<TestClass> GetEnumerator()
            {
                return items.GetEnumerator();
            }

            IEnumerator IEnumerable.GetEnumerator()
            {
                return GetEnumerator();
            }
        }

        class NonGenericEnumerable : IEnumerable
        {
            List<object> items = new List<object>();

            public void Add(object item)
            {
                items.Add(item);
            }

            public IEnumerator GetEnumerator()
            {
                return items.GetEnumerator();
            }
        }

        class TestClass
        {
            public string TestStringValue { get; set; }

            public object Property { get; set; }

            public object Property1 { get; set; }

            private object Property2 { get; set; }

            public override bool Equals(object obj)
            {
                var other = obj as TestClass;
                if (other == null)
                    return false;
                return EqualityComparer<string>.Default.Equals(TestStringValue, other.TestStringValue) &&
                    EqualityComparer<object>.Default.Equals(Property, other.Property) &&
                    EqualityComparer<object>.Default.Equals(Property1, other.Property1) &&
                    EqualityComparer<object>.Default.Equals(Property2, other.Property2);
            }

            public override int GetHashCode()
            {
                int hash = 765;
                if (TestStringValue != null)
                    hash += 5 * TestStringValue.GetHashCode();
                if (Property != null)
                    hash += 7 * Property.GetHashCode();
                if (Property1 != null)
                    hash += 11 * Property1.GetHashCode();
                if (Property2 != null)
                    hash += 13 * Property2.GetHashCode();
                return hash;
            }
        }

        class SimpleTestClass
        {
        }

        #endregion
    }
}
