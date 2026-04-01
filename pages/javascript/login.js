async function login(event) {
    event.preventDefault();

    const dados = {
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value
    };

    try {
        const response = await fetch('http://localhost:5000/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        
        const data = await response.json(); 

        if (response.ok && data.token) {
            // Guardando o token e os dados do usuário corretamente
            localStorage.setItem('@Odonty:token', data.token);
            localStorage.setItem('@Odonty:user', JSON.stringify(data.user));

            alert("Login realizado com Sucesso!");
            
            // Teste o redirecionamento para onde você quiser
            // window.location.href = "home.html";
        } else {
            // Se o e-mail ou senha estiverem errados
            alert(data.error || "E-mail ou senha incorretos");
        }
    } catch (error) {
        console.error("Erro ao conectar:", error);
        alert("Servidor fora do ar. Verifique o terminal do Node!");
    }
}

// Vincula direto ao ID do <form> que está no seu login.html
document.getElementById('login').addEventListener('submit', login);