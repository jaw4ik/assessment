namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddColumnIntroductionContentToTableCourse : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Courses", "IntroductionContent", c => c.String(nullable: true));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Courses", "IntroductionContent");
        }
    }
}
