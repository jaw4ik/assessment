using System;
using System.Collections.Generic;
using System.Threading;

namespace easygenerator.Infrastructure
{
    public class Locker
    {
        private static Dictionary<string, LockState> locks = new Dictionary<string, LockState>();

        /// <summary>
        /// Acquires an exclusive lock for the current key. The lock releases when the returned object is disposed.
        /// </summary>
        /// <param name="key">The key to identify the lock.</param>
        /// <returns>The lifetime object that holds the lock. When the object is disposed, the lock is released.</returns>
        public static IDisposable Lock(string key)
        {
            LockState lockObj = GetState(key);
            return new LockScope(lockObj);
        }

        /// <summary>
        /// Suspends the current lock for the specified key.
        /// </summary>
        /// <param name="key">The key.</param>
        /// <exception cref="InvalidOperationException">Lock is not acquired or is held by a different thread.</exception>
        /// <returns>The lifetime object that controls the lock suspension.</returns>
        public static IDisposable SuspendLock(string key)
        {
            LockState lockObj = GetState(key);
            return new SuspendScope(lockObj);
        }

        /// <summary>
        /// Gets the state object for the specified key.
        /// </summary>
        /// <param name="key">The key.</param>
        /// <returns>The state object for the specified key.</returns>
        private static LockState GetState(string key)
        {
            lock (locks)
            {
                LockState lockState;
                if (!locks.TryGetValue(key, out lockState))
                {
                    lockState = new LockState(key);
                    locks.Add(key, lockState);
                }
                // Adds self as a waiter thread.
                Interlocked.Increment(ref lockState.Waiting);
                return lockState;
            }
        }

        #region Nested Types

        /// <summary>
        /// The object being locked with the <see cref="Monitor"/>. Also holds the number of the threads waiting for the lock to be released.
        /// </summary>
        class LockState
        {
            /// <summary>
            /// The number of the waiting threads.
            /// </summary>
            public int Waiting = 0;
            /// <summary>
            /// The key that identifies the lock.
            /// </summary>
            public string Key;

            /// <summary>
            /// The ID of the thread that holds the lock.
            /// </summary>
            public int ThreadId = -1;

            /// <summary>
            /// Initializes a new instance of the <see cref="LockState"/> class.
            /// </summary>
            /// <param name="key">The lock key.</param>
            public LockState(string key)
            {
                this.Key = key;
            }
        }

        /// <summary>
        /// The class holding the lock. Manages the waiting threads count and releases the lock when the instance is being disposed.
        /// </summary>
        class LockScope : IDisposable
        {
            private LockState obj;

            /// <summary>
            /// Acquires the lock on the object. If the object is already locked by a different thread, blocks the code execution until the lock is acquired.
            /// </summary>
            /// <param name="obj">The obj.</param>
            public LockScope(LockState obj)
            {
                this.obj = obj;
                // Try to acquire the lock.
                Monitor.Enter(obj);
                // Store the thread id that is holding a lock.
                obj.ThreadId = Thread.CurrentThread.ManagedThreadId;
                // Removes self from the waiters.
                Interlocked.Decrement(ref obj.Waiting);
            }

            /// <summary>
            /// Releases the lock.
            /// </summary>
            public void Dispose()
            {
                lock (Locker.locks)
                {
                    // Reset the thread id that holds the lock.
                    obj.ThreadId = -1;
                    // If no threads are waiting for the lock, remove the entry from the locks collection.
                    if (obj.Waiting == 0)
                        Locker.locks.Remove(obj.Key);
                    Monitor.Exit(obj);
                }
            }
        }

        /// <summary>
        /// The class controlling the lock suspention.
        /// </summary>
        class SuspendScope : IDisposable
        {
            private LockState obj;

            /// <summary>
            /// Releases the lock if it is held by the current thread.
            /// </summary>
            /// <param name="obj">The obj.</param>
            /// <exception cref="InvalidOperationException">Lock is not acquired or is held by a different thread.</exception>
            public SuspendScope(LockState obj)
            {
                if (obj.ThreadId == Thread.CurrentThread.ManagedThreadId)
                {
                    this.obj = obj;
                    Interlocked.Increment(ref obj.Waiting);
                    obj.ThreadId = -1;
                    Monitor.Exit(obj);
                }
                else
                {
                    throw new InvalidOperationException("Cannot suspend lock for key: " + obj.Key + ". No lock exists or it was acquired from a different thread.");
                }
            }

            /// <summary>
            /// Re-acquire the lock.
            /// </summary>
            public void Dispose()
            {
                if (obj == null)
                    return;
                Monitor.Enter(obj);
                obj.ThreadId = Thread.CurrentThread.ManagedThreadId;
                Interlocked.Decrement(ref obj.Waiting);
            }
        }

        #endregion
    }
}
