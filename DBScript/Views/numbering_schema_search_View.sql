CREATE OR REPLACE VIEW numbering_schema_search_View AS 
SELECT 
    ns.Numbering_Schema_Id,
    f.Function_Name,
    f.Function_Id,
    ns.Prefix,
    ns.Suffix,
    m.Meta_Sub_Description AS StatusName,
    ns.date_format,
    IFNULL(m1.Meta_Sub_Description, '') AS DateFormatName,
    ns.Symbol_Id AS SymbolId,
    IFNULL(m2.Meta_Sub_Description, '') AS SymbolName,
    ns.Status,
    ns.Modified_On
FROM 
    numbering_schema ns 
INNER JOIN 
    `function` f ON f.Function_Id = ns.document_id
INNER JOIN 
    metadata m ON m.Meta_Sub_Id = ns.Status
LEFT JOIN 
    metadata m1 ON m1.Meta_Sub_Id = ns.Date_Format
LEFT JOIN 
    Metadata m2 ON m2.Meta_Sub_Id = ns.Symbol_Id;
