import Excel from 'exceljs'
import { getFirebaseDocs, createHeaderExcel, createRowTitle } from "./index"
import { saveAs } from 'file-saver'
import { EFFICIENCY_COLUMNS } from '../constants/efficiency-columns-name'

const generateEfficiencyExcel = async() => {
    const workbook = new Excel.Workbook()
    try {
        const workSheet = workbook.addWorksheet('UPT - Aproveitamento', {views: [{showGridLines:false}]})
        createHeaderExcel(workSheet, workbook)
        createRowTitle(workSheet, ['EXTENSÃO', 'QUANTIDADE DE ALUNOS / ALUNOS APROVADOS ', 'APROVEITAMENTO'], /[a-c]/gi, EFFICIENCY_COLUMNS)
        workSheet.getColumn(4).width = 25
        workSheet.getColumn(5).width = 25
        workSheet.getColumn(6).width = 25
        workSheet.getColumn(7).width = 25
        workSheet.getColumn(8).width = 25
        workSheet.getColumn(9).width = 25
        workSheet.getColumn(10).width = 25
        /* const data = await getFirebaseDocs('Alunos') */

        const buffer = await workbook.xlsx.writeBuffer()
        saveAs(new Blob([buffer]),`UPT - Aproveitamento.xlsx`)
    }catch(err){
        console.error(err)
    }finally {
        workbook.removeWorksheet('UPT - Aproveitamento');
    }
}
export default generateEfficiencyExcel