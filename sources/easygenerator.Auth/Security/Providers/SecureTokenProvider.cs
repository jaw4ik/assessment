using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using easygenerator.Auth.Providers.Cryptography;
using easygenerator.Infrastructure.Serialization.Providers;

namespace easygenerator.Auth.Security.Providers
{
    public class SecureTokenProvider<T>: ISecureTokenProvider<T>
    {
        private readonly ISerializationProvider<T> _serializationProvider;
        private readonly ICryptographyConfigurationProvider _cryptographyConfigurationProvider;

        private readonly PaddingMode _paddingMode;
        private readonly byte[] _salt;

        public SecureTokenProvider(ISerializationProvider<T> serializationProvider, ICryptographyConfigurationProvider cryptographyConfigurationProvider)
        {
            _serializationProvider = serializationProvider;
            _cryptographyConfigurationProvider = cryptographyConfigurationProvider;

            _paddingMode = PaddingMode.PKCS7;
            _salt = new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 };
        }

        public string GenerateToken(T dataObject)
        {
            string token = null;
            var data = _serializationProvider.Serialize(dataObject);
            var dataBuff = Encoding.UTF8.GetBytes(data);

            using (var aes = Aes.Create())
            {
                var crypto = new Rfc2898DeriveBytes(_cryptographyConfigurationProvider.Secret, _salt);
                aes.Padding = _paddingMode;
                aes.Key = crypto.GetBytes(32);
                aes.IV = crypto.GetBytes(16);

                using (var mStream = new MemoryStream())
                {
                    using (var cStream = new CryptoStream(mStream, aes.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        cStream.Write(dataBuff, 0, dataBuff.Length);
                        cStream.Close();
                    }
                    token = Convert.ToBase64String(mStream.ToArray());
                }
            }
            return token;
        }

        public T GetDataFromToken(string token)
        {
            string data = null;
            var cryptDataBuff = Convert.FromBase64String(token);

            using (var aes = Aes.Create())
            {
                var crypto = new Rfc2898DeriveBytes(_cryptographyConfigurationProvider.Secret, _salt);
                aes.Padding = _paddingMode;
                aes.Key = crypto.GetBytes(32);
                aes.IV = crypto.GetBytes(16);

                using (var mStream = new MemoryStream())
                {
                    using (var cStream = new CryptoStream(mStream, aes.CreateDecryptor(), CryptoStreamMode.Write))
                    {
                        cStream.Write(cryptDataBuff, 0, cryptDataBuff.Length);
                        cStream.Close();
                    }
                    data = Encoding.UTF8.GetString(mStream.ToArray());
                }
            }
            var dataObject = _serializationProvider.Deserialize(data);
            return dataObject;
        }
    }
}