import { Container, ContainerButtons } from "./style"
import React, { useState } from 'react'
import { TPolos } from "../../common/types"
import { POLOS, POLOS_EXTENSOES } from "../../constants/polos-extensoes"
import { formatedPolo, generateEfficiencyExcel, generateStudentsExcel, getFirebaseDocs } from "../../utils"
import InputMask from 'react-input-mask';
import { addDoc, collection, doc, updateDoc } from "firebase/firestore"
import { db } from "../../config/firebase"
import Excel from 'exceljs'

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
    const [ editionYear, setEditionYear ] = useState('')
    
    const [excelFile, setExcelFile ] = useState<File | null>(null)

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
                            if(rowIndex >= 11 && rowIndex <= 35) {
                                const rowValues = row.values as any
                                console.log(rowValues,rowIndex)
                                const studentsCollections = collection(db,'Alunos') // Inside db, get Alunos Collection
                                await addDoc(studentsCollections,{
                                    name:rowValues[2] || 'n??o informado',
                                    phone: rowValues[3] || 'n??o informado',
                                    course: rowValues[4] || 'n??o informado',
                                    institution: rowValues[5] || 'n??o informado',
                                    institutionLocation: rowValues[6] || 'n??o informado',
                                    selectionType:rowValues[7] || 'n??o informado',
                                    placing: rowValues[8] || 'n??o informado',
                                    extensao:rowValues[9] || 'n??o informado',
                                    polo: rowValues[10] || 'n??o informado'
                                })
                            }else {
                                return
                            }
                           

                        })
                    })
                })
        };   
    }

    /* const fillDocuments = async() => {
        const docs = await getFirebaseDocs('Alunos')
        docs.forEach(async(document) => {
            const collectionRef = collection(db,'Alunos')
            const documentRef = doc(collectionRef,document.id )
            await updateDoc(documentRef, {editionYear:2021})
            console.log(documentRef)
        })

    } */
    

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
            phone: phone || 'n??o informado',
            course: course || 'n??o informado',
            institution: institution || 'n??o informado',
            institutionLocation: institutionLocation || 'n??o informado',
            selectionType: selectionType ||  'n??o informado',
            placing: placing || 'n??o informado',
            polo:formatedPolo(selectedPolo),
            extensao,
            editionYear: editionYear || 'n??o informado' 

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
        setEditionYear('')
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
                <input type="text" placeholder="Curso de aprova????o" value={course} onChange={(event) => setCourse(event.target.value)}/>
                <input type="text" placeholder="Universidade / Faculdade" value={institution} onChange={(event) => setInstitution(event.target.value)}/>
                <input type="text" placeholder="Local / Munic??pio da universidade / Faculdade" value={institutionLocation} onChange={(event) => setInstitutionLocation(event.target.value)}/>
                <input type="text" placeholder="Tipo de sele????o ex: SISU" value={selectionType} onChange={(event) => setSelectionType(event.target.value)}/>
                <input type="text" placeholder="Coloca????o no vestibular / Processo seletivo" value={placing} onChange={(event) => setPlacing(event.target.value)}/>
                <input type="text" placeholder="Ano de edi????o do upt" value={editionYear} onChange={(event) => setEditionYear(event.target.value)}/>

                <select onChange={handleChangePolo} value={selectedPolo}>

                    <option value="" disabled selected hidden>Selecione o Polo</option>
                    {
                        POLOS.map((polo) => (
                                <option value={polo}>{formatedPolo(polo as TPolos)}</option>
                        ))
                    }
                    
                </select>

                <select onChange={handleChangeExtensao} value={extensao} >
                    <option value="" disabled selected hidden>{`Turma / Extens??o UPT ${new Date().getFullYear()}`}</option>
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
                        <button onClick={generateStudentsExcel}>Gerar planilha dos alunos</button>
                        {/*<button onClick={fillDocuments}>Preencher vazios</button>*/}                        
                        {/* <button onClick={generateEfficiencyExcel}>Gerar planilha de aproveitamento</button> */}
                    </div>
                    
                    
                    {/* <div>
                        <input type="file" onChange={handleFileChange} />
                        <button disabled={!excelFile} onClick={uploadData}>Carregar dados da planilha</button>
                    </div> */}
                    
                </ContainerButtons>
            </Container>
    )
}