CREATE TABLE `visitor_doc_detail` (
  `Visitor_Doc_Id` int NOT NULL AUTO_INCREMENT,
  `Visitor_Id` bigint NOT NULL,
  `Id_Card_Type` varchar(50) NOT NULL,
  `Id_Card_No` varchar(100)  NOT NULL,
  `Id_Card_Url` varchar(100) DEFAULT NULL,
  `Status` int NOT NULL,
  PRIMARY KEY (`Visitor_Doc_Id`),
  KEY `fk_Visitor_Doc_Detail_Visitor_Id` (`Visitor_Id`),
  CONSTRAINT `fk_Visitor_Doc_Detail_Visitor_Id` FOREIGN KEY (`Visitor_Id`) REFERENCES `visitor` (`Visitor_Id`)
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
