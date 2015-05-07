﻿using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens;
using System.Security.Claims;


namespace easygenerator.Auth.Providers
{
    public class JsonWebTokenProvider : ITokenProvider
    {
        public string CreateToken(string issuer, string audience, byte[] secret, IEnumerable<Claim> claims)
        {
            var jwtToken = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: new SigningCredentials(
                    signingKey: new InMemorySymmetricSecurityKey(secret),
                    signatureAlgorithm: SecurityAlgorithms.HmacSha256Signature,
                    digestAlgorithm: SecurityAlgorithms.HmacSha256Signature));

            var tokenHandler = new JwtSecurityTokenHandler();
            return tokenHandler.WriteToken(jwtToken);
        }
    }
}
