# Encurtador de URL

Aplicação rest, desenvolvida em [Nest.js](https://nestjs.com/) and [PostgreSQL](https://www.postgresql.org/).

## Executando a aplicação

1. Instalar o [Node.js](https://nodejs.org/en/download/)
2. Instalar o [Docker Compose](https://docs.docker.com/compose/install/). Ele precisa ser iniciado.
3. Clonar a aplicação:

```bash
git clone git@github.com:cidmiranda/encurtador-url.git
```

4. Vá até a pasta da aplicação

```bash
cd encurtador-url
```

5. Execute a imagem docker

```bash
npm run docker-compose
```

Se receber algum erro após esse comando, tente executar

```bash
docker-compose -f docker-compose.yml -f dbadmin.yml up --build
```

6. Acesse a documentação da aplicação em http://localhost:3000/api.

![Swagger](https://drive.google.com/file/d/1ahJtYeJ9C7THLgHKbCfwud9D-os8kVGy/view?usp=sharing)
Os serviços marcados com cadeado, requerem autenticação. O serviço de criar uma url encurtada (POST) é publico, mas identifica o usuário, se este passar um um token válido. Para testar esse serviço autenticado, sugerimos usar via linha de comando ou um cliente rest como o postman.

Create url (POST)

```bash
curl -X 'POST' \
'http://localhost:3000' \
-H 'accept: application/json' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer  <jwt token>>' \
-d '{"longUrl": "http://www.uol.com.br"}'
```

Para receber um token de autenticação é necessário se cadastrar utilizando o serviço 

User signup (POST)

```bash
curl -X 'POST' \
'http://localhost:3000/auth/signup' \
-H 'accept: */*' \
-H 'Content-Type: application/json' \
-d '{"email": "cidmiranda@gmail.com","password": "12345"}'
```

E então realizar o login
User signup (POST)

```bash
curl -X 'POST' \
'http://localhost:3000/auth/login' \
-H 'accept: */*' \
-H 'Content-Type: application/json' \
-d '{"email": "cidmiranda@gmail.com","password": "12345"}'
```
