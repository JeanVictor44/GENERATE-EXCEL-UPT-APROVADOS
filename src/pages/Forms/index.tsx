import { Container, ContainerButtons } from "./style"
import React, { useState } from 'react'
import { Student, TPolos } from "../../common/types"
import { POLOS, POLOS_EXTENSOES } from "../../constants/polos-extensoes"
import { FormatedPolo } from "../../utils/formated-polo"
import InputMask from 'react-input-mask';
import { addDoc, collection, getDocs } from "firebase/firestore"
import { db } from "../../config/firebase"
import Excel from 'exceljs'
import { COLUMNS } from "../../constants/columns-name"
import { saveAs } from 'file-saver'
import { base64LogoUneb, base64LogoUPT} from '../../constants/base64-files'

export const Forms = () => {
    const [ selectedPolo, setSelectedPolo ] = useState<TPolos>('Alagoinhas')
    const [ extensao, setExtensao ] = useState('')
    const [ phone, setPhone ] = useState('')
    const [ course, setCourse ] = useState('')
    const [ institution, setInstitution ] = useState('')
    const [ institutionLocation, setInstitutionLocation ] = useState('')
    const [ selectionType, setSelectionType ] = useState('')
    const [ placing, setPlacing ] = useState('')
    const [ name, setName ] = useState('')

    const [excelFile, setExcelFile ] = useState<File | null>(null)

    const generateExcel = async() => {
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



            // Style and create Title columns 
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


            const data = await excelData()

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

    const excelData = async() => {
        const ref = collection(db,'Alunos')
        const snapshot = await getDocs(ref)
        console.log(snapshot)
        return snapshot.docs.map( doc => doc.data()) as Student[]
    }

    const handleFileChange = (e:React.ChangeEvent<HTMLInputElement> ) => {
        const files = e.target.files as FileList
        setExcelFile(files[0])
    }

    const uploadData = () => {
        const workbook = new Excel.Workbook()
        const reader = new FileReader()
        reader.readAsArrayBuffer(excelFile as File)

        reader.onload = function () {
            const buffer = reader.result as ArrayBuffer
            workbook.xlsx.load(buffer)
                .then(() => {
                    workbook.eachSheet((sheet) => {
                        sheet.eachRow( async(row,rowIndex) => {
                            if(rowIndex >= 11 && rowIndex <= 495) {
                                const rowValues = row.values as any
                                console.log(rowValues,rowIndex)
                                const studentsCollections = collection(db,'Alunos') // Inside db, get Alunos Collection
                                await addDoc(studentsCollections,{
                                    name:rowValues[2] || 'não informado',
                                    phone: rowValues[3] || 'não informado',
                                    course: rowValues[4] || 'não informado',
                                    institution: rowValues[5] || 'não informado',
                                    institutionLocation: rowValues[6] || 'não informado',
                                    selectionType:rowValues[7] || 'não informado',
                                    placing: rowValues[8] || 'não informado',
                                    extensao:rowValues[9] || 'não informado',
                                    polo: rowValues[10] || 'não informado'
                                })
                            }else {
                                return
                            }
                           

                        })
                    })
                })
        };
        
    }
    
    

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
    } 
    
    const handleChangeExtensao = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setExtensao(event.target.value)
    }

    const handleChangePolo = (event: React.ChangeEvent<HTMLSelectElement>) =>  {
        setSelectedPolo(event.target.value as TPolos)
    }

    const handleCreateStudent = async() => {
        const studentsCollections = collection(db,'Alunos') // Inside db, get Alunos Collection
        await addDoc(studentsCollections,{
            name,
            phone,
            course,
            institution,
            institutionLocation,
            selectionType,
            placing,
            polo:FormatedPolo(selectedPolo),
            extensao
        })

        setSelectedPolo('Alagoinhas')
        setPhone('')
        setPlacing('')
        setCourse('')
        setInstitution('')
        setInstitutionLocation('')
        setSelectionType('')
        setExtensao(POLOS_EXTENSOES[selectedPolo][0])     
        setName('')   
    }

    return (
  
            <Container onSubmit={handleSubmit}>
                <h1>CADASTRAR ALUNO </h1>
                <input type="text" placeholder="Aluno" value={name} onChange={(event) => setName(event.target.value)}/>
                <InputMask 
                    placeholder="Telefone"
                    mask='(99) 99999-9999'
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}>    
                </InputMask>
                <input type="text" placeholder="Curso de aprovação" value={course} onChange={(event) => setCourse(event.target.value)}/>
                <input type="text" placeholder="Universidade / Faculdade" value={institution} onChange={(event) => setInstitution(event.target.value)}/>
                <input type="text" placeholder="Local / Município da universidade / Faculdade" value={institutionLocation} onChange={(event) => setInstitutionLocation(event.target.value)}/>
                <input type="text" placeholder="Tipo de seleção ex: SISU" value={selectionType} onChange={(event) => setSelectionType(event.target.value)}/>
                <input type="text" placeholder="Colocação no vestibular / Processo seletivo" value={placing} onChange={(event) => setPlacing(event.target.value)}/>

                <select onChange={handleChangePolo} value={selectedPolo}>

                    <option value="" disabled selected hidden>Selecione o Polo</option>
                    {
                        POLOS.map((polo) => (
                                <option value={polo}>{FormatedPolo(polo as TPolos)}</option>
                        ))
                    }
                    
                </select>

                <select onChange={handleChangeExtensao} value={extensao} >
                    <option value="" disabled selected hidden>{`Turma / Extensão UPT ${new Date().getFullYear()}`}</option>
                    {
                        POLOS_EXTENSOES[selectedPolo].map((extensao) => (
                            <option value={extensao}>{extensao}</option>
                        ))
                    }
                </select>
                {/* Limpar inputs quando clicar em cadastrar */}
                <ContainerButtons>
                    <div>
                        <button onClick={handleCreateStudent}>Cadastrar</button>
                        <button onClick={generateExcel}>Gerar Excel</button>
                    </div>

                  {/*   <div>
                        <input type="file" onChange={handleFileChange} />
                        <button disabled={!excelFile} onClick={uploadData}>Carregar dados da planilha</button>
                    </div> */}
                    
                </ContainerButtons>
            </Container>
    )
}