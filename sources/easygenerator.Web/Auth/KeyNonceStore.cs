using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DotNetOpenAuth.Messaging.Bindings;

namespace easygenerator.Web.Auth
{
    public class KeyNonceStore : INonceStore, ICryptoKeyStore
    {
        private List<Tuple<String, String, CryptoKey>> keysList = new List<Tuple<String, String, CryptoKey>>();
        private List<Tuple<String, String, DateTime>> noncesList = new List<Tuple<String, String, DateTime>>();

        public CryptoKey GetKey(string bucket, string handle)
        {
            var key = keysList.SingleOrDefault(t => t.Item1.Equals(bucket, StringComparison.OrdinalIgnoreCase) &&
                                                    t.Item2.Equals(handle, StringComparison.OrdinalIgnoreCase));
            if (key != null)
            {
                return key.Item3;
            }
            return null;
        }

        public IEnumerable<KeyValuePair<string, CryptoKey>> GetKeys(string bucket)
        {
            return keysList.Where(t => t.Item1.Equals(bucket, StringComparison.OrdinalIgnoreCase))
                           .Select(t => new KeyValuePair<string, CryptoKey>(t.Item2, t.Item3));
        }

        public void RemoveKey(string bucket, string handle)
        {
            keysList.RemoveAll(t => t.Item1.Equals(bucket, StringComparison.OrdinalIgnoreCase) &&
                                    t.Item2.Equals(handle, StringComparison.OrdinalIgnoreCase));
        }

        public void StoreKey(string bucket, string handle, CryptoKey key)
        {
            keysList.Add(new Tuple<string, string, CryptoKey>(bucket, handle, key));
        }

        public bool StoreNonce(string context, string nonce, DateTime timestampUtc)
        {
            if (noncesList.Any(t => t.Item1.Equals(context, StringComparison.OrdinalIgnoreCase) &&
                                    t.Item2.Equals(nonce, StringComparison.OrdinalIgnoreCase) &&
                                    t.Item3 == timestampUtc))
            {
                return false;
            }
            noncesList.Add(new Tuple<string, string, DateTime>(context, nonce, timestampUtc));
            return true;
        }
    }
}