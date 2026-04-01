
async function cadastrarUsuario(event) {
     event.preventDefault();

     const dados ={
        nome:document.getElementById('nome').value,
        email:document.getElementById('email').value,
        senha:document.getElementById('senha').value,
        confirmacaoSenha:document.getElementById('confirmacaoSenha').value,
        provider:false
     }

     const response = await fetch('http://localhost:5000/users',{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body:JSON.stringify(dados)
     })


     const data= await response.json();

     if(response.status===201){
        alert("Usuario Cadastrado Com Sucesso")
         window.location.href="../html/login.html"
     }
     else{
        alert("Erro no Cadastro"|| data.error);
        
     }


}

// Vincula a função ao formulário
document.getElementById('formCadastro').addEventListener('submit', cadastrarUsuario);
