
const data = await fetch('http://localhost:3333/questions/list')
.then(data => {
return data.json();
});


const datas = [ 
  {  
    category: "Sítio Cultural",
      //titulos: [{
      //titulo: [
       // "Museu Nacional",
       // "Museu do Catetinho",
      //  ],
     // },
   // ],
    questions: [
      {
        question: "Quiz não Cadastrado",
        options: ["Quiz não Cadastrado"],    
      },
    ],
    
  },
  {
    category: "Monumento",
   
   
    questions: [
      {
        question: "Quiz não Cadastrado",
        options: ["Quiz não Cadastrado"],    
      },
    ],
  },
  {
    category: "Museu",
    titulos: "Museu Nacional",
    titullo: "Museu do Catetinho",
    questions: [
      {
        question: "Qual ano de inaguração do Museu Nacional ?",
        options: [
          "2000",
          "2006",
          "1995",
          "2009",
        ],
        answer: "2006",
        tip: "Foi depois dos anos 2000",
      },
      {
        question: "Qual nome do arquiteto responsável pela Obra ?",
        options: [
         "Roberto Burle Marx",
         "Lúcio Costa", 
         "Oscar Niemeyer ",
         "Rosa Grena Kliass"
        ],
        answer: "Roberto Burle Marx",
      },
      {
        question: "Qual nome dado ao conjunto de Obras ao seu redor ?",
        options: [
          "Centro cultural de Brasília",
          "Complexo cultural de Brasília",
          "Complexo Cultural da República João Herculino",
          "Espaço da cultura nacional"
        ],
        answer: "Complexo Cultural da República João Herculino",
        tip: "Recebeu o nome de um político",
      },
      {
        question: "O auditório maior do museu possui quantos lugares para o público?",
        options: [
          "500 lugares", 
          "450 lugares", 
          "390 lugares", 
          "700 lugares"
        ],
        answer: "700 lugares",
      },
      {
        question:
          "Qual a missão do Museu Nacional da República?",
        options: [
          "Elevar e revelar ao maior número de pessoas possível, a cultura visual contemporânea.", 
          "Organizar as informações do mundo todo e torná-las acessíveis e úteis em caráter universal.", 
          "Levar inspiração e inovação para os atletas de todo o mundo.", 
          "Levar alegria para todas as pessoas do mundo."],
        answer: "Elevar e revelar ao maior número de pessoas possível, a cultura visual contemporânea.",
      },
      {
        question:
          "O que é o Museu Nacional da República?",
        options: [
          "É um espaço que insere Brasília no circuito internacional das artes e mostra o que há de melhor na arte brasileira.", 
          "O Museu Nacional da República é integrante do Conjunto Cultural da República.", 
          "Obra de Oscar Niemeyer, o Museu começou a ser construído em 1999.", 
          "Foi idealizado para fazer parte do Setor Cultural Sul da Nova Capital."],
        answer: "É um espaço que insere Brasília no circuito internacional das artes e mostra o que há de melhor na arte brasileira.",
      },
      {
        question:
          "Quais os horários de visitação?",
        options: [
          "Horário de visitação: sextas, sábados e domingos das 08h às 12h.", 
          "Horário de visitação: sextas, sábados e domingos das 06h às 10h.", 
          "Horário de visitação: sextas, sábados e domingos das 10h às 16h.", 
          "Horário de visitação: sextas, sábados e domingos das 13h às 19h"],
        answer: "Horário de visitação: sextas, sábados e domingos das 10h às 16h.",
      },
      {
        question:
          "Qual endereço, do Museu Nacional da República?",
        options: [
          "Endereço: Setor Cultural Sul, lote 2, próximo à Rodoviária do Plano Piloto – Zona 0.", 
          "Endereço: Zona cívico Administrativa, Esplanada dos Ministérios – Lote 12.", 
          "Endereço: Eixo Monumental - Lado Oeste - Praça do Cruzeiro.", 
          "Endereço: Feira de Artesanato da Torre de TV SDC - Eixo Monumental."],
        answer: "Endereço: Setor Cultural Sul, lote 2, próximo à Rodoviária do Plano Piloto – Zona 0.",
      },
    ],
  },
  {
    category: "Outros",
    questions: [
      {
        question: "Quiz não Cadastrado",
        options: ["Quiz não Cadastrado"],    
      },
    ],
  },
];

export default data;
