import express from 'express'
import cors from 'cors'

// Importação das rotas
import quizRoutes from './routes/quizRoutes.js'

const app = express()
const port = 5000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use('/api/v1/quizzes', quizRoutes)

// Rota Raiz de Teste
app.get('/', (req, res) => {
  res.send('API Connect rodando');
});

// Inicialização do Servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});