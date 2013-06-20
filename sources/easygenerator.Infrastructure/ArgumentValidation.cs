﻿using System;
using System.Collections.Generic;

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
                string message = String.Format("{0} cannot be empty.", argumentName);

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
                throw new ArgumentException(String.Format("The value of {0} cannot be empty.", argumentName), argumentName);
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
                throw new ArgumentException(String.Format("The value '{0}' is not expected for Enum of type '{1}'", toValidate, typeof(T).Name), argumentName);
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

        private static void ThrowIfLongerThan(string toValidate, int length, string argumentName)
        {
            if (toValidate.Length > length)
            {
                throw new ArgumentOutOfRangeException(argumentName, String.Format("The value of {0} cannot be longer than {1}.", argumentName, length));
            }
        }

        #endregion
    }
}
