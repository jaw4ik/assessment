BEGIN TRANSACTION;

DECLARE @SummaryOfChanges TABLE(Change VARCHAR(20)); 

MERGE INTO UserDomains AS Target  
USING (SELECT Domain FROM NotTrackedDomains) AS Source (Domain)
ON Target.Domain = Source.Domain  
WHEN MATCHED THEN  
UPDATE SET Tracked = 0  
WHEN NOT MATCHED BY TARGET THEN  
INSERT (Domain) VALUES (Source.Domain)  
OUTPUT $action INTO @SummaryOfChanges;  
  
-- Query the results of the table variable.  
SELECT Change, COUNT(*) AS CountPerChange  
FROM @SummaryOfChanges  
GROUP BY Change;  

COMMIT;