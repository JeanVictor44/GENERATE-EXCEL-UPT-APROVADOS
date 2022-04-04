import { saveAs } from 'file-saver'
import Excel from 'exceljs'
import { getFirebaseDocs, createHeaderExcel, createRowTitle, styleRowData} from "./index"
import { STUDENT_COLUMNS } from "../constants/student-columns-name"

const generateStudentsExcel = async() => {
    const workbook = new Excel.Workbook()
    try {
        const workSheet = workbook.addWorksheet('Lista de aprovações', {views: [{showGridLines:false}]})
        createHeaderExcel(workSheet, workbook)
        createRowTitle(workSheet, ['N°', 'ALUNO', 'TELEFONE DE CONTATO', 'CURSO DE APROVAÇÃO', 'UNIVERSIDADE/FACULDADE', 'LOCAL/MUNICÍPIO DA \n UNIVERSIDADE/FACULDADE', 'TIPO DE SELEÇÃO', 'COLOCAÇÃO NO VESTIBULAR/PROCESSO SELETIVO', `MUNICÍPIO/EXTENSÃO DA TURMA UPT ${new Date().getFullYear()}`, 'POLO','ANO DE EDIÇÃO DO UPT'], /[a-k]/gi, STUDENT_COLUMNS)
        
        //get firebase data
        const data = await getFirebaseDocs('Alunos')
        
        // Insert firebase data
        data.forEach((singleData,index) => {
            const newSingleData = {
                    number:index + 1,
                    ...singleData
                }
            workSheet.addRow(newSingleData)
            
        })

        styleRowData(workSheet)

        const buffer = await workbook.xlsx.writeBuffer()
        saveAs(new Blob([buffer]),`Lista de aprovados.xlsx`)
    }catch(err){
        console.error(err)
    }finally {
        workbook.removeWorksheet('Lista de aprovações');
    }
}
export default generateStudentsExcel