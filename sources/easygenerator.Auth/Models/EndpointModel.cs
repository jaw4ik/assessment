using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.Auth.Models
{
    public class EndpointModel
    {
        public string Name { get; set; }
        public byte[] Secret { get; set; }
        public string Scopes { get; set; }
        public string Audience { get; set; }
    }
}
