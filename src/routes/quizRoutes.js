import express from 'express'
import { criar, listarTodos, listarLiberados, buscarPorId, liberar ,responder } from '../controllers/quizController.js'

const router = express.Router()

router.post('/criarQuiz', criar)                         // POST http://localhost:5000/api/quizzes/criarQuiz
router.get('/listarQuizzes', listarTodos)                // GET  http://localhost:5000/api/quizzes/listarQuizzes
router.get('/listarQuizzesLiberados', listarLiberados)   // GET  http://localhost:5000/api/quizzes/listarQuizzesLiberados
router.get('/buscarQuiz/:id', buscarPorId)               // GET  http://localhost:5000/api/quizzes/buscarQuiz/{ID}
router.patch('/liberarQuiz/:id', liberar)                // PATCH http://localhost:5000/api/quizzes/liberar/{ID}
router.post('/responder/:id', responder)                 // POST http://localhost:5000/api/v1/quizzes/responder/{ID_QUIZ}

export default router