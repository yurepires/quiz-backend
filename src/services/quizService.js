import prisma from '../lib/prisma.js';

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
  });

  return quiz;
};

export const listarQuizzes = async () => {

  const quizzes = await prisma.quiz.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { perguntas: true }
      }
    }
  });

  return quizzes;
};

export const listarQuizzesLiberados = async () => {

  const quizzes = await prisma.quiz.findMany({
    where: {liberado: true},
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { perguntas: true }
      }
    }
  });

  return quizzes;
};

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
  });

  return quiz;
};

export const liberarQuiz = async (id) => {
  const quiz = await prisma.quiz.update({
    where: { id },
    data: { liberado: true }
  });

  return quiz;
};