using easygenerator.Web.Components.ActionFilters;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Web;
using System.Web.Mvc;

namespace easygenerator.Web.Tests.Components.ActionFilters
{
    [TestClass]
    public class NoCacheAttributeTests
    {
        private IResultFilter _noCacheAttribute;

        private ResultExecutingContext _filterContext;
        private HttpCachePolicyBase _cache;

        [TestInitialize]
        public void InitializeContext()
        {
            _noCacheAttribute = new NoCache();

            _filterContext = Substitute.For<ResultExecutingContext>();
            var httpResponse = Substitute.For<HttpResponseBase>();
            _cache = Substitute.For<HttpCachePolicyBase>();

            _filterContext.HttpContext = Substitute.For<HttpContextBase>();
            _filterContext.HttpContext.Response.Returns(httpResponse);
            httpResponse.Cache.Returns(_cache);
        }

        #region OnResultExecuting

        [TestMethod]
        public void OnResultExecuting_ShouldSetCacheExpiresDate()
        {
            //Arrange

            //Act
            _noCacheAttribute.OnResultExecuting(_filterContext);

            //Assert
            _cache.Received().SetExpires(Arg.Any<DateTime>());
        }

        [TestMethod]
        public void OnResultExecuting_ShouldSetValidUntilExpiresFalse()
        {
            //Arrange

            //Act
            _noCacheAttribute.OnResultExecuting(_filterContext);

            //Assert
            _cache.Received().SetValidUntilExpires(false);
        }

        [TestMethod]
        public void OnResultExecuting_ShouldSetAllCachesRevalidation()
        {
            //Arrange

            //Act
            _noCacheAttribute.OnResultExecuting(_filterContext);

            //Assert
            _cache.Received().SetRevalidation(HttpCacheRevalidation.AllCaches);
        }

        [TestMethod]
        public void OnResultExecuting_ShouldSetNoCacheCacheability()
        {
            //Arrange

            //Act
            _noCacheAttribute.OnResultExecuting(_filterContext);

            //Assert
            _cache.Received().SetCacheability(HttpCacheability.NoCache);
        }

        [TestMethod]
        public void OnResultExecuting_ShouldSetNoStore()
        {
            //Arrange

            //Act
            _noCacheAttribute.OnResultExecuting(_filterContext);

            //Assert
            _cache.Received().SetNoStore();
        }

        #endregion
    }
}
