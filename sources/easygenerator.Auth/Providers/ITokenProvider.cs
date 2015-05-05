﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace easygenerator.Auth.Providers
{
    public interface ITokenProvider
    {
        string CreateToken(string issuer, string audience, byte[] secret, IEnumerable<Claim> claims);
    }
}
