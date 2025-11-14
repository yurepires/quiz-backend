# Bem vindo(a) ao Connect api 👋

## Para começar:
1. Clone o projeto:

   ```bash
   git clone git@github.com:DennisGabriel-Dev/connect_api.git
   ```

2. Instale as depedências:

   ```bash
   npm install
   ```

3. Startando o projeto

   ```bash
   npm run start
   ```

## Regras para criação de endpoints:
Iremos usar o padrão REST, esse [guia](https://www.alura.com.br/artigos/rest-principios-e-boas-praticas) pode ajudar. <br>
A identificação do recurso deve ser feita utilizando-se o conceito de URI (Uniform Resource Identifier) <br>
Usaremos namespaces para a versão da api, sendo: /api/v1 <br>
Exemplos de como as URIs devem ficar:
- http://minha_url.com/api/v1/usuarios;
- http://minha_url.com/api/v1/atividades;
- http://minha_url.com/api/v1/usuarios/12;
- http://minha_url.com/api/v1/perguntas

Obs: para atualizar, deletes ou exibições, iremos delegar aos verbos do HTTP: GET, POST, PUT, PATCH, DELETE.



## Importante:
Para contribuir com a aplicação, abra apenas um PR com todo o código produzido pela equipe.<br>
Sugestão de nomeclatura das branchs: se seu grupo for de QRCode por exemplo, você pode usar a seguinte nomeclatura na branch e PR: ```qr_code-feat-xpto```<br>
Por favor, ao abrir o PR, faça uma descrição clara do que foi feito com fotos(se tratando de telas construídas). Isso vai facilitar a revisão de código e agilizar o merge.<br>


## Bom desenvolvimento a todos :)
