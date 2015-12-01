using easygenerator.StorageServer.Models.Entities;
using System;
using System.Data.Entity;

namespace easygenerator.StorageServer.DataAccess
{
    public class DatabaseContext : DbContext, IDataContext, IUnitOfWork
    {
        static DatabaseContext()
        {
            var _ = typeof(System.Data.Entity.SqlServer.SqlProviderServices);

            try
            {
                Database.SetInitializer(new MigrateDatabaseToLatestVersion<DatabaseContext, Migrations.Configuration>());
            }
            catch (Exception)
            {
                throw;
            }
        }

        public DatabaseContext() : base("DefaultConnection") { }

        public DbSet<User> Users { get; set; }
        public DbSet<Video> Videos { get; set; }
        public DbSet<Audio> Audios { get; set; }

        public IDbSet<T> GetSet<T>() where T : Entity
        {
            return Set<T>();
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Properties<Guid>().Where(p => p.Name == "Id").Configure(p => p.IsKey());
            modelBuilder.Properties<DateTime>().Where(p => p.Name == "CreatedOn").Configure(p => p.IsRequired());
            modelBuilder.Properties<DateTime>().Where(p => p.Name == "ModifiedOn").Configure(p => p.IsRequired());
            modelBuilder.Properties<string>().Where(p => p.Name == "CreatedBy").Configure(p => p.IsRequired().HasMaxLength(254));
            modelBuilder.Properties<string>().Where(p => p.Name == "ModifiedBy").Configure(p => p.IsRequired().HasMaxLength(254));

            modelBuilder.Entity<User>().Property(e => e.Email).IsRequired().HasMaxLength(254);
            modelBuilder.Entity<User>().Property(e => e.UsedStorageSpace).IsRequired();
            modelBuilder.Entity<User>().Map(e => e.ToTable("Users"));

            modelBuilder.Entity<Video>().Property(e => e.VimeoId).IsRequired();
            modelBuilder.Entity<Video>().Property(e => e.Title).IsRequired();
            modelBuilder.Entity<Video>().Property(e => e.Size).IsRequired();
            modelBuilder.Entity<Video>().Property(e => e.UserId).IsRequired();
            modelBuilder.Entity<Video>().Map(e => e.ToTable("Videos"));

            modelBuilder.Entity<Audio>().Property(e => e.VimeoId).IsRequired();
            modelBuilder.Entity<Audio>().Property(e => e.Title).IsRequired();
            modelBuilder.Entity<Audio>().Property(e => e.Size).IsRequired();
            modelBuilder.Entity<Audio>().Property(e => e.UserId).IsRequired();
            modelBuilder.Entity<Audio>().Map(e => e.ToTable("Audios"));

            base.OnModelCreating(modelBuilder);
        }

        public void Save()
        {
            SaveChanges();
        }

    }
}