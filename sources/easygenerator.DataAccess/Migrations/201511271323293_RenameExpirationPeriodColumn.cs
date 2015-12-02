namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RenameExpirationPeriodColumn : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ConsumerToolSettings", "ExpirationPeriodDays", c => c.Int());
            DropColumn("dbo.ConsumerToolSettings", "ExpirationPeriod");
        }
        
        public override void Down()
        {
            AddColumn("dbo.ConsumerToolSettings", "ExpirationPeriod", c => c.Int());
            DropColumn("dbo.ConsumerToolSettings", "ExpirationPeriodDays");
        }
    }
}
