using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace easygenerator.Web.SAML.ServiceProvider.Models
{
    public static class SPClaimTypes
    {
        public static readonly IEnumerable<string> Email = (new [] { ClaimTypes.NameIdentifier, ClaimTypes.Email }).AsEnumerable();
        public static readonly IEnumerable<string> FirstName = (new [] { ClaimTypes.GivenName, "FirstName" }).AsEnumerable();
        public static readonly IEnumerable<string> LastName = (new [] { ClaimTypes.Surname, "LastName" }).AsEnumerable();
    }
}