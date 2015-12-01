using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using easygenerator.StorageServer.Attributes;
using easygenerator.StorageServer.DataAccess;

namespace easygenerator.StorageServer.Controllers
{
    [Authorize, Scope("storage")]
    public class DefaultStorageApiController : ApiController { }
}