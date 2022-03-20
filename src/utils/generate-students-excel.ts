import { COLUMNS } from "../constants/columns-name"
import { saveAs } from 'file-saver'
import { base64LogoUneb, base64LogoUPT} from '../constants/base64-files'
import Excel from 'exceljs'
import { getFirebaseDocs } from "./get-firebase-docs"

export const generateStudentsExcel = async() => {
    const workbook = new Excel.Workbook()
    try {
        const workSheet = workbook.addWorksheet('Lista de aprovações', {views: [{showGridLines:false}]})

        workSheet.mergeCells('A1', 'E1')
        workSheet.mergeCells('A2', 'E2')
        workSheet.mergeCells('A3', 'E3')
        workSheet.mergeCells('A4', 'E4')
        workSheet.mergeCells('A5', 'E5')
        workSheet.mergeCells('A7', 'E7')
        workSheet.mergeCells('F1', 'I5')
        
        const A1 = workSheet.getCell('A1')
        const A2 = workSheet.getCell('A2')
        const A4 = workSheet.getCell('A4')
        const A5 = workSheet.getCell('A5')
        const A7 = workSheet.getCell('A7')
        const F1 = workSheet.getCell('F1')

        A1.value = 'UNIVERSIDADE DO ESTADO DA BAHIA'
        A2.value = 'Autorização Decreto n.º 9237/86. dou 18/07/96. Reconhecimento: Portaria 909/95, DOU 01/08-95'
        A4.value = 'PROGRAMA UNIVERSIDADE PARA TODOS'
        A7.value = 'RELAÇÃO DOS ALUNOS APROVADOS NOS VESTIBULARES/PROCESSOS SELETIVOS 2020/2021'
        
        A1.font = {bold: true}
        A4.font = {bold:true, color: {argb: '002060'}}
        A7.font = {bold: true}

        A1.alignment = { horizontal:'center' } 
        A2.alignment = { horizontal:'center'} 
        A4.alignment = { horizontal:'center'} 
        
        A5.border = {
            bottom: {style:'medium'}
        }
        F1.border = {
            left: {style:'medium'},
            right: {style:'medium'},
            bottom: {style:'medium'}
        }
           
        

        const imageId1 = workbook.addImage({
            extension:'jpeg',
            base64:base64LogoUneb
            
        })
        const imageId2 = workbook.addImage({
            extension:'jpeg',
            base64:base64LogoUPT
        })

        workSheet.addImage(imageId1, {
            tl:{col:6, row:0},
            ext:{width:200,height:100},
            
        })
        
        workSheet.addImage(imageId2, {
            tl:{col:8, row:0},
            ext:{width:200,height:100},
            
        })
   
        workSheet.getRow(1).height = 30

        workSheet.getRow(10).values = ['N°', 'ALUNO', 'TELEFONE DE CONTATO', 'CURSO DE APROVAÇÃO', 'UNIVERSIDADE/FACULDADE', 'LOCAL/MUNICÍPIO DA \n UNIVERSIDADE/FACULDADE', 'TIPO DE SELEÇÃO', 'COLOCAÇÃO NO VESTIBULAR/PROCESSO SELETIVO', `MUNICÍPIO/EXTENSÃO DA TURMA UPT ${new Date().getFullYear()}`, 'POLO']
        workSheet.columns = COLUMNS
        workSheet.getRow(10).font = {bold: true}
        workSheet.getRow(10).alignment = {  vertical: 'middle',horizontal: 'center' }
        workSheet.getRow(10).height = 40
        

        workSheet.getRow(10).eachCell(cell => {
            const AJCell = new RegExp(/[a-j]/gi)
            if(AJCell.test(cell.address)){
                cell.border = {
                    top: {style:'double'},
                    left: {style:'double'},
                    bottom: {style:'double'},
                    right: {style:'double'}
                }
                cell.fill = {
                    fgColor:{argb: 'bfbfbf'},
                type:'pattern',
                pattern:'solid',  
                }
            }else {
                return 
            }
        }) 


        const data = await getFirebaseDocs('Alunos')

        data.forEach((singleData,index) => {
            const newSingleData = {
                    number:index + 1,
                    ...singleData
                }
            workSheet.addRow(newSingleData)
            
        })


        //Uppercase all data
        workSheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            const HEADER_ROW = 10
            if(rowNumber > HEADER_ROW){
                row.eachCell(cell => {                    
                    workSheet.getCell(cell.address).alignment = {horizontal: "left"}
                    if(!cell.address.includes('A')){
                        const valueCell = workSheet.getCell(cell.address).value?.toString() as String
                        workSheet.getCell(cell.address).value = valueCell.toUpperCase()

                    }
                    
                    //Aplica borda apenas nas colunas anteriores a K
                    if(cell.address.includes('K')){
                        return 
                    }else {
                        cell.border = {
                            top: {style:'thin'},
                            left: {style:'thin'},
                            bottom: {style:'thin'},
                            right: {style:'thin'}
                        }
                    }
                })
            }
        })

        const buffer = await workbook.xlsx.writeBuffer()
        saveAs(new Blob([buffer]),`Lista de aprovados.xlsx`)
    }catch(err){
        console.error(err)
    }finally {
        workbook.removeWorksheet('Lista de aprovações');
    }
}