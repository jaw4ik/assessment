namespace easygenerator.DataAccess.Migrations
{
    using System.Data.Entity.Migrations;
    
    public partial class SeparateUserSubscription : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "ExpirationDate", c => c.DateTime());

            Sql("UPDATE dbo.Users SET [ExpirationDate] = [AccesTypeExpirationTime]");

            DropColumn("dbo.Users", "AccesTypeExpirationTime");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Users", "AccesTypeExpirationTime", c => c.DateTime());

            Sql("UPDATE dbo.Users SET [AccesTypeExpirationTime] = [ExpirationDate]");

            DropColumn("dbo.Users", "ExpirationDate");
        }
    }
}
