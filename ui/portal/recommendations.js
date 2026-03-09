import { AlertTriangle, Upload, ShieldAlert, FileCheck } from "lucide-react";

export const RECOMMENDATIONS = {
  1: {
    pill: "Constância caindo",
    icon: AlertTriangle,
    userMessage: "Vi um alerta dizendo que minha constância caiu. O que eu faço?",
    summary: "Sua **Caminhada de 10 minutos** caiu de 5 sessões na semana passada para 2 nesta semana.",
    detail:
      "A maior queda está acontecendo nas tardes de baixa energia. O plano ainda faz sentido, mas o primeiro passo está grande demais para dias cansados.\n\n**Melhor próximo movimento:**\n- Criar uma versão de resgate de 5 minutos\n- Deixar o tênis perto da porta antes do almoço\n- Manter uma opção indoor pronta para dias ruins",
    actions: [
      { label: "Diminuir a meta", message: "Me ajuda a diminuir a meta da caminhada para dias de baixa energia" },
      { label: "Ver o padrão", message: "Me mostra onde minha sequência começou a cair" },
      { label: "Dispensar", message: "Valeu, eu resolvo isso manualmente" },
    ],
  },
  2: {
    pill: "Faltando plano B",
    icon: Upload,
    userMessage: "Vi um alerta dizendo que falta um apoio importante. O que eu faço?",
    summary: "Você adicionou uma **Agenda semanal**, mas ainda não existe um plano B simples para os dias em que a rotina quebra.",
    detail:
      "Neste momento o plano depende do dia ideal. Quando o horário muda, não existe nada menor para recorrer.\n\n**Adicione um plano B** como uma caminhada indoor curta, um alongamento de 4 minutos ou um checklist rápido em pé para o movimento sobreviver aos dias imperfeitos.",
    actions: [
      { label: "Adicionar plano B", message: "Quero adicionar um plano B de movimento para dias corridos" },
      { label: "Criar opção indoor", message: "Me ajuda a criar uma rotina indoor de resgate" },
      { label: "Pular por enquanto", message: "Depois eu adiciono esse plano B" },
    ],
  },
  3: {
    pill: "Queda de energia",
    icon: ShieldAlert,
    userMessage: "Vi um alerta sobre queda de energia. O que eu faço?",
    summary: "Sua **Rotina de energia da manhã** tende a quebrar nos dias com menos de 6 horas de sono.",
    detail:
      "A rotina atual pede demais antes de sua energia estabilizar.\n\n**Sugestão do coach:**\n- Reduzir a primeira ação para menos de 3 minutos\n- Deixar água e tênis visíveis na noite anterior\n- Adiar o celular até depois do primeiro gatilho de movimento",
    actions: [
      { label: "Criar versão leve", message: "Cria uma versão de baixa energia da minha rotina da manhã" },
      { label: "Ver impacto do sono", message: "Me mostra como o sono está afetando minha constância" },
      { label: "Anotado", message: "Anotado, obrigado" },
    ],
  },
  4: {
    pill: "Semana concluída",
    icon: FileCheck,
    userMessage: "Vi uma nota dizendo que minha semana terminou. O que vem agora?",
    summary: "Sua semana de **Sequência de mobilidade pós-trabalho** terminou e já pode ser revisada.",
    detail:
      "Você fechou o ciclo com 9 sessões concluídas e uma rotina noturna mais forte.\n\n**O que funcionou:**\n1. Sessões curtas facilitaram o começo\n2. Um fluxo de resgate protegeu a sequência em dias corridos\n3. Um horário estável reduziu fadiga de decisão\n\n**Próximo passo:** revisar as vitórias, manter os gatilhos mais leves e subir a intensidade só um pouco.",
    actions: [
      { label: "Abrir revisão", message: "Abre minha revisão semanal da sequência de mobilidade" },
      { label: "Planejar próxima semana", message: "Me ajuda a planejar a próxima semana com base nesse progresso" },
      { label: "Manter leve", message: "Quero manter o mesmo nível por mais uma semana" },
    ],
  },
};

export function getActiveRecommendations({ recommendationParam }) {
  if (!recommendationParam) return [];

  const ids = recommendationParam
    .split(",")
    .map((id) => parseInt(id.trim(), 10))
    .filter((id) => RECOMMENDATIONS[id]);

  return ids.map((id) => ({ id, ...RECOMMENDATIONS[id] }));
}
