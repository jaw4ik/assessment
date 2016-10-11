namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddPositionToLearningContent : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.LearningContents", "Position", c => c.Decimal(nullable: false, precision: 18, scale: 15));
        }
        
        public override void Down()
        {
            DropColumn("dbo.LearningContents", "Position");
        }
    }
}
