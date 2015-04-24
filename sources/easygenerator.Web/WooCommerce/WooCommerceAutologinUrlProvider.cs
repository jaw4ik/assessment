using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.WooCommerce
{
    public interface IWooCommerceAutologinUrlProvider
    {
        string GetAutologinUrl(string username);
    }

    public class WooCommerceAutologinUrlProvider : IWooCommerceAutologinUrlProvider
    {
        private readonly ConfigurationReader _configurationReader;

        public WooCommerceAutologinUrlProvider(ConfigurationReader configurationReader)
        {
            _configurationReader = configurationReader;
        }

        public string GetAutologinUrl(string username)
        {
            return string.Format("{0}/my-account/?sso={1}", _configurationReader.WooCommerceConfiguration.ServiceUrl, GenerateAutologinToken(username));
        }

        private string GenerateAutologinToken(string username)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(username, "username");

            var key = _configurationReader.WooCommerceConfiguration.AutologinKey;
            var vector = _configurationReader.WooCommerceConfiguration.AutologinVector;

            ArgumentValidation.ThrowIfNullOrEmpty(key, "key");
            ArgumentValidation.ThrowIfNullOrEmpty(vector, "vector");

            using (var alg = new RijndaelManaged())
            {
                alg.Padding = PaddingMode.Zeros;
                alg.Mode = CipherMode.CBC;
                alg.BlockSize = 256;

                alg.Key = Encoding.UTF8.GetBytes(key);
                alg.IV = Encoding.UTF8.GetBytes(vector);

                using (var encryptor = alg.CreateEncryptor())
                {
                    using (var ms = new MemoryStream())
                    {
                        using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                        {
                            using (var sw = new StreamWriter(cs))
                            {
                                sw.Write(username);
                            }
                        }
                        var token = Convert.ToBase64String(ms.ToArray()) + "|" + Convert.ToBase64String(Encoding.UTF8.GetBytes(vector));
                        var encodedToken = HttpServerUtility.UrlTokenEncode(Encoding.UTF8.GetBytes(token));

                        return encodedToken.Substring(0, encodedToken.Length - 1);
                    }
                }

            }
        }
    }
}