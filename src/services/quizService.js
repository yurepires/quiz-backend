import prisma from '../lib/prisma.js'

export const criarQuiz = async (dados) => {
  const quiz = await prisma.quiz.create({
    data: {
      titulo: dados.titulo,
      descricao: dados.descricao,
      dataPalestra: new Date(dados.dataPalestra),
      liberado: false,
      perguntas: {
        create: dados.perguntas.map(pergunta => ({
          texto: pergunta.texto,
          pontos: pergunta.pontos,
          opcoes: {
            create: pergunta.opcoes.map(opcao => ({
              texto: opcao.texto,
              eCorreta: opcao.eCorreta
            }))
          }
        }))
      }
    },
    include: {
      perguntas: {
        include: { opcoes: true }
      }
    }
  })

  return quiz
}

export const listarQuizzes = async () => {

  const quizzes = await prisma.quiz.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { perguntas: true }
      }
    }
  })

  return quizzes
}

export const listarQuizzesLiberados = async () => {

  const quizzes = await prisma.quiz.findMany({
    where: {liberado: true},
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { perguntas: true }
      }
    }
  })

  return quizzes
}

// Busca quiz pelo id para o aluno
// 'eCorreta' não é enviado
export const buscarQuizPorId = async (id) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      perguntas: {
        select: {
          id: true,
          texto: true,
          pontos: true,
          opcoes: {
            select: {
              id: true,
              texto: true
            }
          }
        }
      }
    }
  })

  return quiz
}

export const liberarQuiz = async (id) => {
  const quiz = await prisma.quiz.update({
    where: { id },
    data: { liberado: true }
  })

  return quiz
}

/**
 * Responder Quiz e Calcular Pontuação
 * @param {string} quizId - ID do quiz
 * @param {string} usuarioId - ID do usuário logado
 * @param {Array<{perguntaId: string, opcaoId: string}>} respostas - Array de respostas do usuário
 */
export const responderQuiz = async (quizId, usuarioId, respostas) => {
  // Verifica se o usuário já respondeu
  const tentativaExistente = await prisma.tentativa.findUnique({
    where: {
      usuarioId_quizId: {
        usuarioId,
        quizId,
      },
    },
  })

  if (tentativaExistente) {
    throw new Error('O usuário já respondeu a este quiz.')
  }

  // Busca o quiz e as respostas corretas
  const quizComRespostas = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      perguntas: {
        include: {
          opcoes: true,
        },
      },
    },
  })

  if (!quizComRespostas || !quizComRespostas.liberado) {
    throw new Error('Quiz não encontrado ou não liberado.')
  }

  let pontuacaoObtida = 0
  let pontuacaoMaxima = 0

  // Calcula a pontuação
  for (const respostaUsuario of respostas) {
    const pergunta = quizComRespostas.perguntas.find(
      (p) => p.id === respostaUsuario.perguntaId
    )

    if (!pergunta) continue

    pontuacaoMaxima += pergunta.pontos // Acumula pontuação máxima

    const opcaoSelecionada = pergunta.opcoes.find(
      (o) => o.id === respostaUsuario.opcaoId
    )

    if (opcaoSelecionada && opcaoSelecionada.eCorreta) {
      // Se a opção selecionada for a correta, adiciona os pontos da pergunta
      pontuacaoObtida += pergunta.pontos
    }
  }

  // Salva tentativa e atualiza pontuação total do usuário
  const [tentativa, usuarioAtualizado] = await prisma.$transaction([
    // Cria o registro de Tentativa
    prisma.tentativa.create({
      data: {
        usuarioId,
        quizId,
        pontosObtidos: pontuacaoObtida,
      },
    }),

    // Atualiza a pontuação total do Usuário
    prisma.usuario.update({
      where: { id: usuarioId },
      data: {
        pontosTotais: {
          increment: pontuacaoObtida,
        },
      },
    }),
  ])

  return {
    tentativa,
    pontuacaoMaxima,
    usuarioPontuacaoTotal: usuarioAtualizado.pontosTotais,
  }
}