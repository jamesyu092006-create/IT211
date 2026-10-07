function renderExam(config) {
    const root = document.getElementById("examRoot");

    root.innerHTML = `
        <div class="topbar">
            <div>
                <span class="badge">${config.badge}</span>
                <h1>${config.title}</h1>
            </div>
            <a class="btn secondary" href="home.html">Back</a>
        </div>

        <p class="subtitle">Select one answer for every question, then click Submit Exam.</p>
        <div id="resultArea"></div>
        <form id="examForm"></form>
        <div id="answerReview" class="answer-review"></div>
    `;

    const form = document.getElementById("examForm");

    config.questions.forEach((item, index) => {
        const q = document.createElement("div");
        q.className = "question";

        const p = document.createElement("p");
        p.textContent = `${index + 1}. ${item.q}`;
        q.appendChild(p);

        for (const letter of ["A", "B", "C", "D"]) {
            const label = document.createElement("label");
            label.className = "option";
            label.dataset.question = index;
            label.dataset.letter = letter;

            label.innerHTML = `
                <input type="radio" name="q${index}" value="${letter}" required>
                ${letter}. ${escapeHtml(item.options[letter])}
            `;
            q.appendChild(label);
        }

        form.appendChild(q);
    });

    const submitBtn = document.createElement("button");
    submitBtn.className = "btn";
    submitBtn.type = "submit";
    submitBtn.textContent = "Submit Exam";
    form.appendChild(submitBtn);

    form.addEventListener("submit", (e) => submitExam(e, config));
}

function submitExam(event, config) {
    event.preventDefault();

    let score = 0;
    const review = document.getElementById("answerReview");
    review.innerHTML = "";

    config.questions.forEach((item, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        const userAnswer = selected ? selected.value : "";
        const ok = userAnswer === item.answer;
        if (ok) score++;

        document.querySelectorAll(`[data-question="${index}"]`).forEach(label => {
            const letter = label.dataset.letter;
            const input = label.querySelector("input");
            input.disabled = true;

            if (letter === item.answer) label.classList.add("correct-option");
            else if (letter === userAnswer) label.classList.add("wrong-option");
        });

        const itemDiv = document.createElement("div");
        itemDiv.className = `answer-item ${ok ? "correct" : "wrong"}`;
        itemDiv.innerHTML = `
            <strong>${index + 1}. ${escapeHtml(item.q)}</strong><br>
            Your answer: ${userAnswer || "No answer"} |
            Correct answer: ${item.answer} — ${escapeHtml(item.options[item.answer])}
        `;
        review.appendChild(itemDiv);
    });

    const percent = Math.round((score / config.questions.length) * 100);
    const passClass = score >= config.passScore ? "pass" : "fail";

    document.getElementById("resultArea").innerHTML = `
        <div class="result ${passClass}">
            Your Score: ${score}/${config.questions.length} (${percent}%)
        </div>
        <div class="review-actions">
            <button class="btn" type="button" onclick="location.reload()">Try Again</button>
            <a class="btn secondary" href="home.html">Back to Modules</a>
        </div>
    `;

    const submit = document.querySelector('#examForm button[type="submit"]');
    if (submit) submit.remove();

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function escapeHtml(text) {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
