import styled from "styled-components";

export const Container = styled.form `
    display:flex;
    flex-direction:column;
    gap:20px;
    width:100%;
    max-width:580px;
    margin:0 auto;
    padding:5px;
    input {
        padding-left:20px;
    }
    h1 {
        text-align:center;
    }
    button {
        background-color:var(--blue);
        color:#FFF;
        padding:5px;
        
    }
`

export const ContainerButtons = styled.div `
    display:flex;
    flex-direction:column;
    gap:20px;
    div {
        display:flex;
        gap:10px;
        button {
            flex:1;
        }
    }
`