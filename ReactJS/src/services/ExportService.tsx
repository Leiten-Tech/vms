import autoTable from "jspdf-autotable";
import { saveAs } from 'file-saver';
import * as xlsx from 'xlsx'
import * as fileSaver from 'file-saver'
// export const ExportService = () => {

export const exportServ = {
    Export: (filename: string, dataList: ExportClass[], exportFormat: 'pdf' | 'excel', excelExtension: 'xlsx' | 'csv' = 'xlsx') => {
        switch (exportFormat) {
            case 'pdf':
                exportToPdf(filename, dataList);
                break;
            case 'excel':
                exportExcel(dataList, filename, excelExtension);
                break;
        }
    }
}

const exportToPdf = (filename: string, dataList: ExportClass[]) => {
    if (filename.indexOf('.pdf') === -1) filename += '.pdf';
    let headList = GetHeadList(dataList);
    let doubleHeadList: string[][] = [headList];
    const data = dataList.map(Object.values);
    import("jspdf").then(jsPDF => {
        import("jspdf-autotable").then(x => {
            const doc = new jsPDF.default('l', 'mm', 'a4');
            autoTable(doc, {
                head: doubleHeadList,
                body: data,
                tableLineColor: [0, 0, 0],
                tableLineWidth: 0,
                styles: {
                    lineColor: [0, 0, 0],
                    lineWidth: 0.1,
                },
                // theme: 'grid',
                headStyles: {
                    fillColor: [211, 211, 211],
                    textColor: 0
                    // fontSize: 15,
                },
                bodyStyles: {
                    textColor: 0
                },
                didDrawCell: (data) => { },
            });
            doc.save(filename);
        })
    })
}
const exportExcel = (dataList: ExportClass[], excelName: string, extenstion: 'xlsx' | 'csv') => {
    // xlsx.then(xlsx => {
    const worksheet = xlsx.utils.json_to_sheet(dataList, { cellStyles: true });
    const workbook = { Sheets: { 'Sheet_1': worksheet }, SheetNames: ['Sheet_1'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: extenstion, type: 'array' });
    saveAsExcelFile(excelBuffer, excelName);
    // });
}

const saveAsExcelFile = (buffer: any, fileName: string): void => {

    // fileSaver.then(FileSaver => {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    // });
}

const GetHeadList = (value: ExportClass[]): string[] => {
    let first = value.find(f => true);
    let headList = Object.getOwnPropertyNames(first);
    return headList;
}

const GetCustomizedList = (dataList: ExportClass[], headList: string[]): ExportClass[] => {
    let resList: ExportClass[] = [];
    dataList.forEach(value => {
        let res = {};
        headList.forEach(head => {
            res[head] = value[head];
        });
        resList.push(res);
    });
    return resList;
}
// }
export class ExportClass {
    [key: string]: string | number;
}
