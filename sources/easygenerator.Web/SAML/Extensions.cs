using Kentor.AuthServices.WebSso;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Web.Mvc;
using System.Xml;
using Kentor.AuthServices;
using Kentor.AuthServices.Saml2P;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace easygenerator.Web.SAML
{
    public static class Extensions
    {
        public static ActionResult ToActionResult(this CommandResult commandResult)
        {
            if (commandResult == null)
            {
                throw new ArgumentNullException(nameof(commandResult));
            }

            switch (commandResult.HttpStatusCode)
            {
                case HttpStatusCode.SeeOther:
                    return new RedirectResult(commandResult.Location.OriginalString);
                case HttpStatusCode.OK:
                    var result = new ContentResult()
                    {
                        Content = commandResult.Content
                    };

                    if (!string.IsNullOrEmpty(commandResult.ContentType))
                    {
                        result.ContentType = commandResult.ContentType;
                    }

                    return result;
                default:
                    throw new NotImplementedException();
            }
        }

        public static CommandResult BindSamlResponse(this Saml2Binding saml2Binding, ISaml2Message message)
        {
            if(message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var xml = message.ToXml();
            if (message.SigningCertificate != null)
            {
                var xmlDoc = new XmlDocument()
                {
                    PreserveWhitespace = true
                };

                xmlDoc.LoadXml(xml);
                xmlDoc.Sign(message.SigningCertificate, true);
                xml = xmlDoc.OuterXml;
            }

            var encodedXml = Convert.ToBase64String(Encoding.UTF8.GetBytes(xml));
            var relayState = string.IsNullOrEmpty(message.RelayState) ? null : message.RelayState;

            var result = new Dictionary<string, string>
            {
                [message.MessageName] = encodedXml,
                ["RelayState"] = relayState,
                ["DestinationUrl"] = message.DestinationUrl.OriginalString
            };


            return new CommandResult()
            {
                ContentType = "application/json",
                Content = JsonConvert.SerializeObject(result, new KeyValuePairConverter())
            };
        }
    }
}
