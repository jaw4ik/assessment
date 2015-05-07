using System;
using System.Linq;
using easygenerator.Web.Synchronization.Tracking;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.Web.Tests.Synchronization.Tracking
{
    [TestClass]
    public class UserConnectionTrackerTests
    {
        #region AddConnection

        [TestMethod]
        public void AddConnection_WhenConnectionIdIsNull_ShouldThrowArgumentNullException()
        {
            var userConnectionTracker = new UserConnectionTracker();
            Action action = () => userConnectionTracker.AddConnection(null, "user");

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("connectionId");
        }

        [TestMethod]
        public void AddConnection_WhenConnectionIdIsEmpty_ShouldThrowArgumentException()
        {
            var userConnectionTracker = new UserConnectionTracker();
            Action action = () => userConnectionTracker.AddConnection("", "user");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("connectionId");
        }

        [TestMethod]
        public void AddConnection_WhenUserIsNull_ShouldThrowArgumentNullException()
        {
            var userConnectionTracker = new UserConnectionTracker();
            Action action = () => userConnectionTracker.AddConnection("132", null);

            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("user");
        }

        [TestMethod]
        public void AddConnection_WhenUserIsEmpty_ShouldThrowArgumentException()
        {
            var userConnectionTracker = new UserConnectionTracker();
            Action action = () => userConnectionTracker.AddConnection("123", "");

            action.ShouldThrow<ArgumentException>().And.ParamName.Should().Be("user");
        }

        [TestMethod]
        public void AddConnection_WhenUserCollectionIsEmpty_ShouldAddNewConnectionToList()
        {
            //Arrange
            var userConnectionTracker = new UserConnectionTracker();

            //Act
            userConnectionTracker.AddConnection("connection", "user");

            //Assert
            Assert.AreEqual(userConnectionTracker.GetOnlineUsersCollection().ToList()[0], "user");
            Assert.AreEqual(userConnectionTracker.GetConnectionsCount(), 1);
        }

        [TestMethod]
        public void AddConnection_WhenUserCollectionIsNotEmpty_AndConnectionIdIsUnique_ShouldAddNewConnectionToList()
        {
            //Arrange
            var userConnectionTracker = new UserConnectionTracker();
            userConnectionTracker.AddConnection("connection", "user");

            //Act
            userConnectionTracker.AddConnection("connectionUnique", "userUnique");

            //Assert
            Assert.AreEqual(userConnectionTracker.GetOnlineUsersCollection().ToList()[1], "userUnique");
            Assert.AreEqual(userConnectionTracker.GetConnectionsCount(), 2);
        }

        [TestMethod]
        public void AddConnection_WhenUserCollectionIsNotEmpty_AndConnectionIdIsNotUnique_ShouldRewriteExistingRecord()
        {
            //Arrange
            var userConnectionTracker = new UserConnectionTracker();
            userConnectionTracker.AddConnection("connection", "user");

            //Act
            userConnectionTracker.AddConnection("connection", "userUnique");

            //Assert
            Assert.AreEqual(userConnectionTracker.GetOnlineUsersCollection().ToList()[0], "userUnique");
            Assert.AreEqual(userConnectionTracker.GetOnlineUsersCollection().Count(), 1);
        }

        #endregion

        #region RemoveConnection

        [TestMethod]
        public void RemoveConnection_WhenUserCollectionIsEmpty_ShouldNotChangeConnectionsCount()
        {
            //Arrange
            var userConnectionTracker = new UserConnectionTracker();

            //Act
            var connectionsCount = userConnectionTracker.GetConnectionsCount();
            userConnectionTracker.RemoveConnection("connection");

            //Assert
            Assert.AreEqual(connectionsCount, userConnectionTracker.GetConnectionsCount());
        }

        [TestMethod]
        public void RemoveConnection_WhenUserCollectionIsNotEmpty_AndConnectionNotExists_ShouldNotChangeConnectionsCount()
        {
            //Arrange
            var userConnectionTracker = new UserConnectionTracker();
            userConnectionTracker.AddConnection("connection1", "user1");

            //Act
            var connectionsCount = userConnectionTracker.GetConnectionsCount();
            userConnectionTracker.RemoveConnection("connection2");

            //Assert
            Assert.AreEqual(connectionsCount, userConnectionTracker.GetConnectionsCount());
        }

        [TestMethod]
        public void RemoveConnection_WhenUserCollectionIsNotEmpty_AndConnectionExists_ShouldRemoveConnection()
        {
            //Arrange
            var userConnectionTracker = new UserConnectionTracker();
            userConnectionTracker.AddConnection("connection1", "user1");

            //Act
            var connectionsCount = userConnectionTracker.GetConnectionsCount();
            userConnectionTracker.RemoveConnection("connection1");

            //Assert
            Assert.AreEqual(connectionsCount - 1, userConnectionTracker.GetConnectionsCount());
            Assert.IsNull(userConnectionTracker.GetOnlineUsersCollection().SingleOrDefault(arg => arg == "user1"));
        }

        #endregion

        #region GetConnectionsCount

        [TestMethod]
        public void GetConnectionsCount_WhenUserCollectionIsEmpty_ShouldReturnZero()
        {
            //Arrange
            var userConnectionTracker = new UserConnectionTracker();

            //Act


            //Assert
            Assert.AreEqual(0, userConnectionTracker.GetConnectionsCount());
        }

        [TestMethod]
        public void GetConnectionsCount_WhenUserCollectionIsNotEmpty_ShouldReturnConnectionsCount()
        {
            //Arrange
            var userConnectionTracker = new UserConnectionTracker();

            //Act
            userConnectionTracker.AddConnection("connection1", "user");
            userConnectionTracker.AddConnection("connection2", "user");
            userConnectionTracker.AddConnection("connection3", "user2");

            //Assert
            Assert.AreEqual(3, userConnectionTracker.GetConnectionsCount());
        }

        #endregion

        #region GetOnlineUsersCollection

        [TestMethod]
        public void GetOnlineUsersCollection_WhenUserCollectionIsEmpty_ShouldReturnEmptyCollection()
        {
            //Arrange
            var userConnectionTracker = new UserConnectionTracker();

            //Act


            //Assert
            Assert.AreEqual(0, userConnectionTracker.GetOnlineUsersCollection().Count());
        }

        [TestMethod]
        public void GetOnlineUsersCollection_WhenUserCollectionIsNotEmpty_ShouldReturnUserCollection()
        {
            //Arrange
            var userConnectionTracker = new UserConnectionTracker();

            //Act
            userConnectionTracker.AddConnection("connection1", "user");
            userConnectionTracker.AddConnection("connection2", "user");

            userConnectionTracker.AddConnection("connection3", "user2");

            //Assert
            Assert.AreEqual(2, userConnectionTracker.GetOnlineUsersCollection().Count());
            Assert.AreEqual("user", userConnectionTracker.GetOnlineUsersCollection().ToList()[0]);
            Assert.AreEqual("user2", userConnectionTracker.GetOnlineUsersCollection().ToList()[1]);
        }

        #endregion
    }
}
