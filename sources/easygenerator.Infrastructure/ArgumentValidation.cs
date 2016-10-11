using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace easygenerator.Infrastructure
{
    /// <summary>
    /// Helps with validating the arguments to methods by providing methods that when called will throw an 
    /// <see cref="ArgumentException"/> or a class derived from it if a value does not match certain expectations.
    /// </summary>
    public static class ArgumentValidation
    {
        #region Public Static Methods

        /// <summary>
        /// Throws an <see cref="ArgumentNullException"/> if a collection is <c>null</c> and 
        /// <see cref="ArgumentException"/> if it is empty.
        /// </summary>
        /// <exception cref="ArgumentNullException"><paramref name="toValidate"/> is <c>null</c>.</exception>
        /// <exception cref="ArgumentException"><paramref name="toValidate"/> is empty.</exception>
        public static void ThrowIfNullOrEmpty<TContained>(IList<TContained> toValidate, string argumentName)
        {
            ThrowIfNull(toValidate, argumentName);

            if (toValidate.Count == 0)
            {
                string message = $"{argumentName} cannot be empty.";

                throw new ArgumentException(message, argumentName);
            }
        }

        /// <summary>
        /// Throws an <paramref name="ArgumentNullException"/> if the object to validate is <c>null</c>.
        /// </summary>
        /// <exception cref="ArgumentNullException"><paramref name="toValidate"/> is <c>null</c>.</exception>
        public static void ThrowIfNull(object toValidate, string argumentName)
        {
            if (toValidate == null)
            {
                throw new ArgumentNullException(argumentName);
            }
        }

        /// <summary>
        /// Throws an <see cref="ArgumentNullException"/> if the object to validate is <c>null</c> and 
        /// <see cref="ArgumentException"/> if it is an empty or whitespace string.
        /// </summary>
        /// <exception cref="ArgumentNullException"><paramref name="toValidate"/> is <c>null</c>.</exception>
        /// <exception cref="ArgumentException"><paramref name="toValidate"/> is an empty or whitespace string.</exception>
        public static void ThrowIfNullOrEmpty(string toValidate, string argumentName)
        {
            ThrowIfNull(toValidate, argumentName);

            if (toValidate.Trim() == String.Empty)
            {
                throw new ArgumentException($"The value of {argumentName} cannot be empty.", argumentName);
            }
        }

        /// <summary>
        /// Throws an <see cref="ArgumentException"/> if the value is not defined within the specified enum
        /// </summary>
        /// <exception cref="ArgumentException"><paramref name="toValidate"/> is not defined within the specified enum.</exception>
        public static void ThrowIfEnumIsNotDefined<T>(T toValidate, string argumentName)
        {
            if (!Enum.IsDefined(typeof(T), toValidate))
            {
                throw new ArgumentException(
                    $"The value '{toValidate}' is not expected for Enum of type '{typeof(T).Name}'", argumentName);
            }
        }

        /// <summary>
        /// Throws an <see cref="ArgumentOutOfRangeException"/> if the specified string is longer than 255 symbols
        /// </summary>
        /// <exception cref="ArgumentOutOfRangeException"><paramref name="toValidate"/> is longer than 255 symbols.</exception>
        public static void ThrowIfLongerThan255(string toValidate, string argumentName)
        {
            ThrowIfLongerThan(toValidate, 255, argumentName);
        }

        public static void ThrowIfLongerThan65535(string toValidate, string argumentName)
        {
            ThrowIfLongerThan(toValidate, 65535, argumentName);
        }

        private static void ThrowIfLongerThan(string toValidate, int length, string argumentName)
        {
            if (toValidate.Length > length)
            {
                throw new ArgumentOutOfRangeException(argumentName,
                    $"The value of {argumentName} cannot be longer than {length}.");
            }
        }

        public static void ThrowIfNotValidEmail(string email, string argumentName)
        {
            ThrowIfNullOrEmpty(email, argumentName);

            if (email.Length > 254)
                throw new ArgumentException("Invalid email", argumentName);

            if (!Regex.IsMatch(email, Constants.EmailValidationRegexp))
                throw new ArgumentException("Invalid email format", argumentName);
        }

        public static void ThrowIfDateIsInvalid(DateTime date, string argumentName)
        {
            if (date < DateTimeWrapper.MinValue())
            {
                throw new ArgumentException("Expiration date is invalid", argumentName);
            }
        }

        /// <summary>
        /// Throws an <see cref="ArgumentNullException"/> if the object to validate is <c>null</c>.
        /// Throws <see cref="ArgumentException"/> if it is an empty or whitespace string or it is not valid JSON format.
        /// </summary>
        /// <exception cref="ArgumentNullException"><paramref name="toValidate"/> is <c>null</c>.</exception>
        /// <exception cref="ArgumentException"><paramref name="toValidate"/> is an empty or whitespace string or it is not valid JSON format.</exception>
        public static void ThrowIfNotValidJsonFormat<T>(string toValidate, string argumentName)
        {
            ThrowIfNullOrEmpty(toValidate, argumentName);

            try
            {
                JsonConvert.DeserializeObject<T>(toValidate);
            }
            catch
            {
                Type argType = typeof(T);
                string typeName =
                    $"{argType.Name}{(argType.IsGenericType ? "<" + String.Concat(argType.GenericTypeArguments.Select(t => t.Name)) + ">" : "")}";
                throw new ArgumentException($"The value of {argumentName} need to be of {typeName} type.", argumentName);
            }
        }

        public static void ThrowIfNumberIsOutOfRange(decimal number, decimal minAllowed, decimal maxAllowed, string argumentName)
        {
            if (number < minAllowed || number > maxAllowed)
            {
                throw new ArgumentOutOfRangeException(argumentName, $"{argumentName} cannot be less than {minAllowed} and more than {maxAllowed}.");
            }
        }
        #endregion
    }
}
