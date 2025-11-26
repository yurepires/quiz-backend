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

    const quizzes = await quizService.listarQuizzes()
    return res.json(quizzes)
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar quizzes' })
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

export const responder = async (req, res) => {
  try {
    const { id: quizId } = req.params
    const { respostas } = req.body
    
    const usuarioId = req.headers['x-user-id']

    if (!usuarioId) {
      return res.status(401).json({ error: 'ID do usuário é obrigatório para responder o quiz.' })
    }

    const resultado = await quizService.responderQuiz(quizId, usuarioId, respostas)
    
    return res.status(200).json({
      mensagem: `Quiz finalizado! Você obteve ${resultado.tentativa.pontosObtidos} de ${resultado.pontuacaoMaxima} pontos.`,
      resultado,
    })
  } catch (error) {
    if (error.message.includes('já respondeu')) {
      return res.status(400).json({ error: error.message })
    }
    console.error(error)
    return res.status(500).json({ error: 'Erro ao processar respostas.', detalhes: error.message })
  }
}