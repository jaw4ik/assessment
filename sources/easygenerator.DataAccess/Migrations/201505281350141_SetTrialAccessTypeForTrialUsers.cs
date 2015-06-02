namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class SetTrialAccessTypeForTrialUsers : DbMigration
    {
        public override void Up()
        {
            Sql(@"
                    UPDATE Users SET AccessType = 100
                    WHERE 
	                DATEDIFF(DAY, CreatedOn, ExpirationDate) = 14
	                AND AccessType = 2
                ");
        }
        
        public override void Down()
        {
            Sql("UPDATE Users SET AccessType = 2 WHERE AccessType = 100");
        }
    }
}
