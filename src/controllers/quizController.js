import * as quizService from '../services/quizService.js'

export const criar = async (req, res) => {
  try {
    const quiz = await quizService.criarQuiz(req.body)
    return res.status(201).json(quiz)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro ao criar quiz', detalhes: error.message })
  }
}

export const listarTodos = async (req, res) => {
  try {

    const quizzes = await quizService.listarQuizzes();
    return res.json(quizzes);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar quizzes' });
  }
}

export const listarLiberados = async (req, res) => {
  try {

    const quizzesLiberados = await quizService.listarQuizzesLiberados()
    return res.json(quizzesLiberados)
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar quizzes' })
  }
}

export const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params

    const quiz = await quizService.buscarQuizPorId(id)

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz não encontrado' })
    }

    if (!quiz.liberado) {
      return res.status(403).json({ error: 'Este quiz ainda não está liberado.' })
    }

    return res.json(quiz)
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar quiz' })
  }
}

export const liberar = async (req, res) => {
  try {
    const { id } = req.params
    const quiz = await quizService.liberarQuiz(id)
    return res.json({ mensagem: 'Quiz liberado com sucesso!', quiz })
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao liberar quiz' })
  }
}