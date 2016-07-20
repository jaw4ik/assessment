using Kentor.AuthServices.WebSso;
using System;
using System.Collections.Generic;
using System.Globalization;
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

        public static CommandResult BindSamlResponse(this Saml2Binding saml2Binding, ISaml2Message message, string uid = null)
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
            if (!string.IsNullOrEmpty(uid))
            {
                result["uid"] = uid;
            }

            return new CommandResult()
            {
                ContentType = "application/json",
                Content = JsonConvert.SerializeObject(result, new KeyValuePairConverter())
            };
        }

        public static CommandResult BindHtmlSamlResponse(this Saml2Binding saml2Binding, ISaml2Message message, string uid = null)
        {
            if (message == null)
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

            var relayStateHtml = string.IsNullOrEmpty(message.RelayState) ? null
                : string.Format(CultureInfo.InvariantCulture, PostHtmlRelayStateFormatString, message.RelayState);

            var idHtml = string.IsNullOrEmpty(uid) ? null
                : string.Format(CultureInfo.InstalledUICulture, PostHtmlUidFormatString, uid);

            return new CommandResult()
            {
                ContentType = "text/html",
                Content = string.Format(
                    CultureInfo.InvariantCulture,
                    PostHtmlFormatString,
                    message.DestinationUrl,
                    relayStateHtml,
                    idHtml,
                    message.MessageName,
                    encodedXml)
            };
        }

        private const string PostHtmlRelayStateFormatString = @"<input type=""hidden"" name=""RelayState"" value=""{0}""/>";

        private const string PostHtmlUidFormatString = @"<input type=""hidden"" name=""uid"" value=""{0}""/>";

        private const string PostHtmlFormatString = @"<?xml version=""1.0"" encoding=""UTF-8""?>
                                                        <!DOCTYPE html PUBLIC ""-//W3C//DTD XHTML 1.1//EN""""http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"">
                                                        <html xmlns=""http://www.w3.org/1999/xhtml"" xml:lang=""en"">
                                                        <body onload=""document.forms[0].submit()"">
                                                            <noscript>
                                                                <p>
                                                                    <strong>Note:</strong> Since your browser does not support JavaScript, you must press the Continue button once to proceed.
                                                                </p>
                                                            </noscript>
                                                            <form action=""{0}"" method=""post"">
                                                                <div>{1}
                                                                     {2}
                                                                    <input type=""hidden"" name=""{3}"" value=""{4}""/>
                                                                </div>
                                                                <noscript>
                                                                    <div>
                                                                        <input type=""submit"" value=""Continue""/>
                                                                    </div>
                                                                </noscript>
                                                            </form>
                                                        </body>
                                                        </html>";
    }
}
