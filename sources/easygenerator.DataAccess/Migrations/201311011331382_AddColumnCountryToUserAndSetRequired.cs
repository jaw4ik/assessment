namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddColumnCountryToUserAndSetRequired : DbMigration
    {
        public override void Up()
        {
            Sql("UPDATE [dbo].[Users] SET FullName = 'easygenerator user' WHERE FullName IS NULL");
            Sql("UPDATE [dbo].[Users] SET Phone = 'not defined' WHERE Phone IS NULL");
            Sql("UPDATE [dbo].[Users] SET Organization = 'not defined' WHERE Organization IS NULL");
            AlterColumn("dbo.Users", "FullName", c => c.String(nullable: false));
            AlterColumn("dbo.Users", "Phone", c => c.String(nullable: false));
            AlterColumn("dbo.Users", "Organization", c => c.String(nullable: false));
            AddColumn("dbo.Users", "Country", c => c.String(nullable: false, defaultValue: "not defined"));
        }

        public override void Down()
        {
            AlterColumn("dbo.Users", "Organization", c => c.String(nullable: true));
            AlterColumn("dbo.Users", "Phone", c => c.String(nullable: true));
            AlterColumn("dbo.Users", "FullName", c => c.String(nullable: true));
            DropColumn("dbo.Users", "Country");
        }
    }
}
