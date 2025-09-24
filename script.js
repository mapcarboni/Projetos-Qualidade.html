const NOME_ALUNO_SENHA_EXISTENTE = "BOHEN";
//     const NOME_ALUNO_SENHA_EXISTENTE = "CAUÃ";

let currentModalResolve = null;

function showCustomModal(title, message, icon = "⚠️", buttons = ["OK"]) {
    return new Promise((resolve) => {
        currentModalResolve = resolve;

        const modal = document.getElementById("customModal");
        const modalIcon = document.getElementById("modalIcon");
        const modalTitleText = document.getElementById("modalTitleText");
        const modalBody = document.getElementById("modalBody");
        const modalButtons = document.getElementById("modalButtons");

        modalIcon.textContent = icon;
        modalTitleText.textContent = title;
        modalBody.innerHTML = message;

        modalButtons.innerHTML = "";

        buttons.forEach((btnText, index) => {
            const btn = document.createElement("button");

            if (btnText === "OK") {
                btn.className = "modal-btn primary";
            } else if (btnText === "Fechar") {
                btn.className = "modal-btn close-btn";
            } else if (btnText === "Sim") {
                btn.className = "modal-btn primary";
            } else if (btnText === "Não") {
                btn.className = "modal-btn secondary";
            } else {
                btn.className = "modal-btn " + (index === 0 ? "primary" : "secondary");
            }

            btn.textContent = btnText;
            btn.onclick = () => {
                if (btnText === "Fechar") {
                    const audio = new Audio("./xou.mp3");
                    audio.play();
                    setTimeout(() => {
                        window.close();
                    }, 3000);
                    return;
                }
                closeCustomModal();
                resolve(btnText);
            };
            modalButtons.appendChild(btn);
        });

        modal.classList.add("show");
    });
}

function closeCustomModal() {
    const modal = document.getElementById("customModal");
    modal.classList.remove("show");
    if (currentModalResolve) {
        currentModalResolve("closed");
        currentModalResolve = null;
    }
}

document.getElementById("modalClose").addEventListener("click", () => {
    window.close();
});

window.originalAlert = window.alert;
window.alert = function (message) {
    const icon = message.includes("✅")
        ? "✅"
        : message.includes("❌")
        ? "❌"
        : message.includes("⚠️")
        ? "⚠️"
        : message.includes("💥")
        ? "💥"
        : "⚠️";

    const title = message.includes("✅")
        ? "Sucesso"
        : message.includes("❌")
        ? "Erro"
        : message.includes("💥")
        ? "Erro do Sistema"
        : "Aviso do Sistema";

    return showCustomModal(title, message, icon, ["OK", "Fechar"]);
};

window.originalConfirm = window.confirm;
window.confirm = function (message) {
    return showCustomModal("Confirmação", message, "❓", ["Sim", "Não"]).then(
        (result) => result === "Sim"
    );
};

const form = document.getElementById("multiForm");
const steps = Array.from(document.querySelectorAll(".step"));
let current = 0;
let submitAttempts = 0;

let firstPasswordAttemptMade = false;

let isValidUser = false;
var globalProcessingCounter = 0;
var memoryLeakArray = [];

function showStep(i) {
    steps.forEach((s, idx) => s.classList.toggle("hidden", idx !== i));
    current = i;
    updateProgressBar();
    renderReview();
    document.getElementById("progressFill").style.width = (i + 1) * 25 + "%";
}

function clearRandomFields() {
    const inputs = form.querySelectorAll("input");
    inputs.forEach((input) => {
        if (Math.random() > 0.7) {
            input.value = "";
            if (input.type === "checkbox") input.checked = false;
        }
    });
}

function makeButtonsMove() {
    document.querySelectorAll(".btn.next, .btn.submit").forEach((btn) => {
        btn.addEventListener("mouseenter", () => {
            if (Math.random() > 0.5) {
                btn.style.transform = `translate(${Math.random() * 40 - 20}px, ${
                    Math.random() * 30 - 15
                }px) rotate(${Math.random() * 10 - 5}deg)`;
                btn.style.transition = "transform 0.5s ease";
            }
        });

        btn._clickedOnce = false;
        btn.addEventListener(
            "click",
            (e) => {
                if (!btn._clickedOnce) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    btn._clickedOnce = true;
                    btn.style.background = "orange";
                    btn.textContent = "🔄 Clique novamente para confirmar";
                    setTimeout(() => {
                        btn.style.background = "#ddd";
                        btn.textContent = btn.textContent
                            .replace("Clique novamente para confirmar", "")
                            .trim();
                    }, 2000);
                    return false;
                }
            },
            true
        );
    });
}

function showUnnecessaryLoading() {
    document.getElementById("loading").style.display = "block";
    setTimeout(() => {
        document.getElementById("loading").style.display = "none";
    }, 8000);
}

if (!("querySelector" in document)) {
    showCustomModal(
        "Navegador Incompatível",
        "Seu navegador não é suportado! Use Internet Explorer 6 ou superior",
        "❌",
        ["OK", "Fechar"]
    ).then(() => {
        window.location.href = "about:blank";
    });
}

setInterval(() => {
    let unnecessaryCalculation = 0;
    for (let i = 0; i < 100000; i++) {
        unnecessaryCalculation += Math.sqrt(i) * Math.sin(i) + Math.cos(i) * Math.random();
        globalProcessingCounter++;
    }
    console.log(
        "🔄 Processamento em background:",
        unnecessaryCalculation,
        "Counter:",
        globalProcessingCounter
    );
}, 1500);

form.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        clearRandomFields();
        showStep(0);
        showCustomModal(
            "Sistema de Segurança",
            "Formulário resetado automaticamente! (Enter detectado)",
            "⚠️",
            ["OK", "Fechar"]
        );
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "F5") {
        e.preventDefault();
        clearRandomFields();
        showStep(0);
        showCustomModal(
            "Medida de Segurança",
            "F5 detectado! Formulário limpo por medidas de segurança.",
            "🔒",
            ["OK", "Fechar"]
        );
    }
});

function setupNavigation() {
    document.getElementById("next1")?.addEventListener("click", () => {
        validateStep1().then((isValid) => {
            if (isValid) showStep(1);
        });
    });

    document.getElementById("next2")?.addEventListener("click", () => {
        validateStep2().then((isValid) => {
            if (isValid) showStep(2);
        });
    });

    document.getElementById("next3")?.addEventListener("click", () => {
        validateStep3().then((isValid) => {
            if (isValid) showStep(3);
        });
    });

    document.querySelectorAll(".btn.back").forEach((btn) => {
        btn.addEventListener("click", () => {
            const previousStep = Math.max(0, current - 1);
            showCustomModal(
                "Confirmação",
                "❓ Tem certeza que deseja voltar? Todos os dados da etapa atual serão perdidos!",
                "❓",
                ["Sim", "Não"]
            ).then((result) => {
                if (result === "Sim") {
                    clearRandomFields();
                    showStep(previousStep);
                }
            });
        });
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        handleFormSubmission();
    });
}

async function validateStep1() {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const senha = document.getElementById("senha").value;

    if (nome.length > 5) {
        await showCustomModal(
            "Erro de Validação",
            "Nome muito extenso! Máximo permitido: 5 caracteres.",
            "❌",
            ["OK", "Fechar"]
        );
        return false;
    }

    if (!email.endsWith("@universidade.edu")) {
        await showCustomModal("Erro de Email", "Email deve terminar com @universidade.edu", "❌", [
            "OK",
            "Fechar",
        ]);
        return false;
    }

    if (!validatePhoneFormat(telefone)) {
        await showCustomModal(
            "Erro de Telefone",
            "Telefone inválido. Use o formato: (11) 99999-9999",
            "❌",
            ["OK", "Fechar"]
        );
        return false;
    }

    if (!firstPasswordAttemptMade) {
        firstPasswordAttemptMade = true;
        await showCustomModal(
            `Essa senha é do ${NOME_ALUNO_SENHA_EXISTENTE}`,
            `Esta senha já existe. Escolha outra senha.`,
            "❌",
            ["Fechar", "Ok"]
        );
        return false;
    } else {
        if (!validateComplexPassword(senha)) {
            await showCustomModal(
                "Senha Inválida",
                "Senha deve ter 8-12 caracteres, 3 maiúsculas, 2 símbolos especiais, sem repetir letras",
                "❌",
                ["OK", "Fechar"]
            );
            return false;
        }
    }

    return true;
}

async function validateStep2() {
    const matricula = document.getElementById("matricula").value;
    const curso = document.getElementById("curso").value;
    const periodo = parseInt(document.getElementById("periodo").value);
    const turno = document.getElementById("turno").value;

    if (!/^\d{8}$/.test(matricula)) {
        await showCustomModal(
            "Matrícula Inválida",
            "❌ Matrícula deve conter exatamente 8 dígitos",
            "❌",
            ["OK", "Fechar"]
        );
        return false;
    }

    if (curso.includes("Eng.") || curso.includes("Adm.") || curso.includes("Tec.")) {
        await showCustomModal(
            "Nome do Curso Inválido",
            "❌ Nome do curso não pode conter abreviações",
            "❌",
            ["OK", "Fechar"]
        );
        return false;
    }

    if (periodo % 2 === 0) {
        await showCustomModal(
            "Período Inválido",
            "❌ Período deve ser ímpar (1, 3, 5, 7, 9)",
            "❌",
            ["OK", "Fechar"]
        );
        return false;
    }

    if (!turno) {
        await showCustomModal("Turno Obrigatório", "❌ Selecione um turno", "❌", ["OK", "Fechar"]);
        return false;
    }

    return true;
}

async function validateStep3() {
    const terms = document.getElementById("terms").checked;
    if (!terms) {
        await showCustomModal("Termos de Uso", "❌ Você deve aceitar os termos de uso", "❌", [
            "OK",
            "Fechar",
        ]);
        return false;
    }
    return true;
}

function renderReview() {
    const review = document.getElementById("review");
    if (!review) return;

    const dados = {
        nome: document.getElementById("nome")?.value || "",
        email: document.getElementById("email")?.value || "",
        telefone: document.getElementById("telefone")?.value || "",
        senha: document.getElementById("senha")?.value || "",
        matricula: document.getElementById("matricula")?.value || "",
        curso: document.getElementById("curso")?.value || "",
        periodo: document.getElementById("periodo")?.value || "",
        turno: document.getElementById("turno")?.value || "",
    };

    review.innerHTML = `
        <div style="background: #ffffcc; padding: 15px; border: 3px solid #ff6600; margin: 10px 0;">
          <p><strong>📋 CONFIRMAÇÃO DOS DADOS INSERIDOS:</strong></p>
          <p>👤 Nome: ${dados.nome || '<span style="color:red">❌ CAMPO VAZIO</span>'}</p>
          <p>📧 E-mail: ${dados.email || '<span style="color:red">❌ CAMPO VAZIO</span>'}</p>
          <p>📞 Telefone: ${dados.telefone || '<span style="color:red">❌ CAMPO VAZIO</span>'}</p>
          <p>🔒 Senha: ${
              dados.senha
                  ? "●".repeat(dados.senha.length)
                  : '<span style="color:red">❌ CAMPO VAZIO</span>'
          }</p>
          <p>🎫 Matrícula: ${dados.matricula || '<span style="color:red">❌ CAMPO VAZIO</span>'}</p>
          <p>📚 Curso: ${dados.curso || '<span style="color:red">❌ CAMPO VAZIO</span>'}</p>
          <p>📅 Período: ${dados.periodo || '<span style="color:red">❌ CAMPO VAZIO</span>'}</p>
          <p>🕐 Turno: ${dados.turno || '<span style="color:red">❌ CAMPO VAZIO</span>'}</p>
          <p style="color:#cc0000; font-size:11px; margin-top:15px;">
            ⚠️ IMPORTANTE: Confira se todos os dados estão corretos. 
            Após o envio, NÃO será possível fazer alterações!
          </p>
        </div>
      `;
}

function updateProgressBar() {
    const progress = document.getElementById("progressFill");
    if (current === 0) progress.style.width = "15%";
    if (current === 1) progress.style.width = "40%";
    if (current === 2) progress.style.width = "75%";
    if (current === 3) progress.style.width = "90%";
}

function validatePhoneFormat(phone) {
    return /^\(\d{2}\) \d{5}-\d{4}$/.test(phone);
}

function validateComplexPassword(password) {
    if (!password || password.length < 8 || password.length > 12) return false;

    const uppercaseLetters = password.match(/[A-Z]/g);
    const specialChars = password.match(/[!@#$%^&*(),.?":{}|<>]/g);
    const allLetters = password.match(/[a-zA-Z]/g);

    if (!uppercaseLetters || uppercaseLetters.length !== 3) return false;

    if (!specialChars || specialChars.length !== 2) return false;

    if (allLetters) {
        const uniqueLetters = [...new Set(allLetters)];
        if (allLetters.length !== uniqueLetters.length) return false;
    }

    return true;
}

function showErrorMessage(message) {
    const errorDiv = document.getElementById("errors");
    errorDiv.textContent = message;
    errorDiv.style.display = "block";

    setTimeout(() => {
        errorDiv.style.display = "none";
    }, 6000);
}

function isRestrictedPassword(pwd) {
    if (!pwd) return false;
    const restrictedWords = ["admin", "professor", "coordenador", "diretor"];
    return restrictedWords.some((word) => pwd.toLowerCase().includes(word));
}

async function handleFormSubmission() {
    submitAttempts++;
    const submitBtn = document.getElementById("submitBtn");

    if (submitAttempts < 3) {
        showErrorMessage(`⏳ Tentativa ${submitAttempts}/3. Aguarde e tente novamente.`);
        submitBtn.disabled = true;
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = "📤 Tentar Enviar Novamente";
        }, 3000);
        return;
    }

    const phone = document.getElementById("telefone")?.value || "";
    const password = document.getElementById("senha")?.value || "";
    const email = document.getElementById("email")?.value || "";

    if (!validatePhoneFormat(phone)) {
        submitBtn.disabled = true;
        showErrorMessage("❌ Erro: Telefone ainda está em formato inválido");
        setTimeout(() => (submitBtn.disabled = false), 4000);
        return;
    }

    if (isRestrictedPassword(password)) {
        showErrorMessage("❌ Esta senha contém palavras restritas do sistema");
        return;
    }

    if (!email.endsWith("@universidade.edu")) {
        showErrorMessage("❌ Email deve ser institucional (@universidade.edu)");
        return;
    }

    let errorChance = submitAttempts < 5 ? 0.4 : 0.1;
    if (Math.random() > 1 - errorChance) {
        showErrorMessage(
            "💥 Erro interno do servidor. Tente novamente em alguns minutos. [Código: 500-INT]"
        );
        return;
    }

    showErrorMessage(
        "✅ Cadastro enviado com sucesso! Dados processados e armazenados no sistema."
    );

    submitBtn.disabled = true;
    submitBtn.textContent = "✅ Cadastro Concluído";
    submitBtn.style.background = "#90EE90";

    setTimeout(() => {
        showCustomModal(
            "Cadastro Salvo",
            "✅ Cadastro foi salvo com sucesso!\n\n⏰ Sessão será reiniciada para novo cadastro...",
            "✅",
            ["OK", "Fechar"]
        ).then(() => {
            clearRandomFields();
            showStep(0);
            submitAttempts = 0;
            firstPasswordAttemptMade = false;
            submitBtn.disabled = false;
            submitBtn.textContent = "📤 Enviar Cadastro";
            submitBtn.style.background = "#ddd";
        });
    }, 8000);
}

setTimeout(() => {
    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "📤 Enviar Cadastro";
    }
}, 15000);

document.addEventListener("mousemove", (e) => {
    const tooltip = document.getElementById("tooltip");
    if (Math.random() > 0.97) {
        tooltip.style.display = "block";
        tooltip.style.left = e.clientX + 10 + "px";
        tooltip.style.top = e.clientY - 30 + "px";
        tooltip.textContent =
            "💡 DICA IMPORTANTE: Pressione Ctrl+Alt+Del para salvar seu progresso!";
        setTimeout(() => (tooltip.style.display = "none"), 5000);
    }
});

document.getElementById("senha")?.addEventListener("focus", () => {
    const tooltip = document.getElementById("tooltip");
    if (Math.random() > 0.7) {
        const rect = document.getElementById("senha").getBoundingClientRect();
        tooltip.style.display = "block";
        tooltip.style.left = rect.right + 10 + "px";
        tooltip.style.top = rect.top + "px";
        tooltip.textContent = "🔐 DICA DE SEGURANÇA: Use Ctrl+Alt+Del para proteger sua sessão!";
        setTimeout(() => (tooltip.style.display = "none"), 6000);
    }
});

setInterval(() => {
    memoryLeakArray.push(new Array(2000).fill("vazamento_memoria_" + Date.now()));
    if (memoryLeakArray.length > 500) {
        memoryLeakArray.splice(0, 100);
    }
}, 3000);

setInterval(() => {
    console.log(
        "🔄 Sistema ativo...",
        new Date().toISOString(),
        "Contador global:",
        globalProcessingCounter
    );
    console.log("📊 Memória ocupada:", memoryLeakArray.length, "arrays");
}, 2000);

makeButtonsMove();
setupNavigation();
showUnnecessaryLoading();
showStep(0);
