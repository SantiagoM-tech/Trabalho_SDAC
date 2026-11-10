const details = {
  vs: {
    icon: "🟣", label: "MICROSOFT",
    title: "Visual Studio",
    text: "É um IDE (ambiente de desenvolvimento integrado) da Microsoft. Junta num só programa o editor, ferramentas de compilação, depuração, testes e gestão de projetos. É muito utilizado para desenvolver aplicações .NET e programas para Windows."
  },
  vscode: {
    icon: "🔵", label: "MICROSOFT",
    title: "Visual Studio Code",
    text: "É um editor de código gratuito e multiplataforma. A sua base é mais simples e pode ser ampliada com extensões. Para trabalhar com C#, podem ser instaladas ferramentas como o C# Dev Kit e a extensão C#."
  },
  rider: {
    icon: "🟢", label: "JETBRAINS",
    title: "JetBrains Rider",
    text: "É um IDE multiplataforma da JetBrains, direcionado para .NET. Inclui análise de código, sugestões, refatorização, execução, depuração e testes. É uma opção completa para projetos C# e .NET."
  }
};

document.querySelectorAll("[data-open]").forEach(button => {
  button.addEventListener("click", () => {
    const item = details[button.dataset.open];
    const panel = document.getElementById("detailPanel");
    panel.innerHTML = `<div class="detail-icon">${item.icon}</div><div><span class="eyebrow">${item.label}</span><h3>${item.title}</h3><p>${item.text}</p></div>`;
    panel.scrollIntoView({behavior:"smooth", block:"nearest"});
  });
});

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const opened = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", opened);
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

const codeText = `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Olá, turma!");
    }
}`;
document.getElementById("copyCode").addEventListener("click", async () => {
  const status = document.getElementById("copyStatus");
  try {
    await navigator.clipboard.writeText(codeText);
    status.textContent = "Código copiado!";
  } catch {
    status.textContent = "Seleciona e copia o código manualmente.";
  }
});

const questions = [
  {
    q: "Qual destes programas é um editor de código e não um IDE completo?",
    a: ["Visual Studio", "Visual Studio Code", "JetBrains Rider"],
    correct: 1,
    why: "Certo! O VS Code é um editor de código que pode receber funcionalidades através de extensões."
  },
  {
    q: "Qual é a função principal de um depurador (debugger)?",
    a: ["Criar imagens para o programa", "Aumentar a velocidade da Internet", "Ajudar a encontrar e corrigir erros"],
    correct: 2,
    why: "Exatamente! O depurador permite acompanhar a execução do programa e investigar erros."
  },
  {
    q: "O mesmo código C# pode ser escrito nos três ambientes apresentados?",
    a: ["Sim", "Não, cada ambiente exige uma linguagem diferente", "Só no Visual Studio"],
    correct: 0,
    why: "Correto! A linguagem é C#. O que muda é o conjunto de ferramentas de cada ambiente."
  }
];
let current = 0;
let score = 0;
let answered = false;
const questionText = document.getElementById("questionText");
const answers = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const next = document.getElementById("nextQuestion");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");

function renderQuestion() {
  const item = questions[current];
  answered = false;
  progressText.textContent = `PERGUNTA ${current + 1} DE ${questions.length}`;
  progressBar.style.width = `${((current + 1) / questions.length) * 100}%`;
  questionText.textContent = item.q;
  feedback.textContent = "";
  next.disabled = true;
  next.textContent = current === questions.length - 1 ? "Ver resultado →" : "Seguinte →";
  answers.innerHTML = "";
  item.a.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer";
    button.textContent = answer;
    button.addEventListener("click", () => chooseAnswer(index));
    answers.appendChild(button);
  });
}
function chooseAnswer(index) {
  if (answered) return;
  answered = true;
  const item = questions[current];
  const buttons = [...answers.querySelectorAll("button")];
  buttons.forEach((button, i) => {
    button.disabled = true;
    if (i === item.correct) button.classList.add("correct");
    if (i === index && i !== item.correct) button.classList.add("wrong");
  });
  if (index === item.correct) {
    score++;
    feedback.textContent = "✓ " + item.why;
    feedback.style.color = "#8ce5b3";
  } else {
    feedback.textContent = "✕ Não foi desta vez. " + item.why;
    feedback.style.color = "#ffb1b1";
  }
  next.disabled = false;
}
next.addEventListener("click", () => {
  if (!answered) return;
  if (current < questions.length - 1) {
    current++;
    renderQuestion();
  } else {
    const percent = Math.round(score / questions.length * 100);
    document.querySelector(".quiz-progress").style.display = "none";
    questionText.textContent = `Conseguiste ${score} em ${questions.length}!`;
    answers.innerHTML = `<div class="result-card"><strong>${percent}%</strong><p>${score === 3 ? "Excelente! Dominas os conceitos principais." : score === 2 ? "Muito bem! Já tens uma boa base." : "Bom esforço! Aproveita para rever os conteúdos."}</p></div>`;
    feedback.textContent = "Podes voltar a tentar ou desafiar outra pessoa da turma.";
    next.textContent = "Repetir quiz ↻";
    next.disabled = false;
    next.onclick = () => {
      current = 0; score = 0;
      document.querySelector(".quiz-progress").style.display = "block";
      renderQuestion();
      next.onclick = null;
    };
  }
});
renderQuestion();
