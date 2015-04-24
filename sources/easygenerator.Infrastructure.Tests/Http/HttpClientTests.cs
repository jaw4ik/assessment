using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.Infrastructure.Http;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using easygenerator.Infrastructure.Mail;
using NSubstitute;

namespace easygenerator.Infrastructure.Tests.Http
{
    [TestClass]
    public class HttpClientTests
    {
        //    private HttpClient _httpClient;
        //    private IMailNotificationManager _mailNotificationManager;
        //    private IHttpRequestsManager _httpRequestsManager;

        //    [TestInitialize]
        //    public void InitializeClient()
        //    {
        //        _mailNotificationManager = Substitute.For<IMailNotificationManager>();
        //        _httpRequestsManager = Substitute.For<IHttpRequestsManager>();
        //        _httpClient = new HttpClient(_mailNotificationManager, _httpRequestsManager);
        //    }

        //    [TestMethod]
        //    public void PostOrAddToQueueIfUnexpectedError_ShouldCallPostMethod()
        //    {
        //        var url = "postUrl";
        //        var postObject = new object();

        //        _httpClient.PostOrAddToQueueIfUnexpectedError(url, postObject, Arg.Any<string>());

        //        _httpClient.Received().Post<string>(url, postObject);
        //    }
    }
}