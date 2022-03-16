import styled from "styled-components";

export const Container = styled.form `
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    position:absolute;
    left:50%;
    top:50%;
    transform:translate(-50%,-50%);
    width:100%;
    max-width:400px;
    border:1px solid #000; 
    padding:30px;
    h1 {
        margin:10px 0px 20px 0px;
    }
    input {
        width:100%;
        padding-left:10px;
    }
    input + input {
        margin:20px;
    }
    button {
        width:100%;
        background-color:var(--blue);
        color:#FFF;
    }
`
