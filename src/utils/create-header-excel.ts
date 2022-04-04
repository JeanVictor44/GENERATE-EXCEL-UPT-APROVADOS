import Excel from 'exceljs'
import { base64LogoUneb, base64LogoUPT} from '../constants/base64-files'


const createHeaderExcel = (workSheet: Excel.Worksheet, workbook: Excel.Workbook) => {
    
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

}
export default createHeaderExcel