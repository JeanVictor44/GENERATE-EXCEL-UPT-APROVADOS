import Excel from 'exceljs'

type Column = { key: string, width: number}

const createRowTitle = (workSheet: Excel.Worksheet, titleList: string[], regexColumn: RegExp, columns: Column []) => {
    workSheet.getRow(10).values = titleList
    workSheet.columns = columns
    workSheet.getRow(10).font = {bold: true}
    workSheet.getRow(10).alignment = {  vertical: 'middle',horizontal: 'center' }
    workSheet.getRow(10).height = 40

    workSheet.getRow(10).eachCell(cell => {
        const regColumn = new RegExp(regexColumn)
        if(regColumn.test(cell.address)){
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
}

export default createRowTitle