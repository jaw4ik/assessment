namespace easygenerator.DataAccess.Migrations
{
    using System.Data.Entity.Migrations;
    
    public partial class UpdateColumnUserEmailLength : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Onboardings", "UserEmail", c => c.String(nullable: false, maxLength: 254));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Onboardings", "UserEmail", c => c.String(nullable: false));
        }
    }
}
