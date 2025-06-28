CREATE TABLE if not exists sequences (
    sequence_name VARCHAR(255) PRIMARY KEY,
    next_val INT NOT NULL DEFAULT 1
);
truncate table sequences;
INSERT INTO sequences (sequence_name, next_val) 
VALUES 
('VISITORSeq', 0),
('VISITORENTRYSeq', 0),
('COUNTRYSeq', 0),
('STATESeq', 0),
('VEHICLESeq', 0),
('SHIFTSeq', 0),
('SUPPLIERSeq', 0),
('COMPANYSeq', 0),
('AREASeq', 0),
('ROUTESeq', 0),
('CITYSeq', 0),
('DEPARTMENTSeq', 0),
('GATESeq', 0),
('USERSeq', 0),
('ROLESeq', 0),
('CUSTOMERSeq', 0),
('PLANTSeq', 0),
('WORKPERMITSeq', 0),
('VENDOREGSeq', 0),
('CATCPMAPSeq', 0),
('FEEDBACKSeq', 0);
