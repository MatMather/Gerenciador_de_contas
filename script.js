const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const noteInput = document.getElementById("note");
const saveBtn = document.getElementById("saveBtn");
const savedNotesDiv = document.getElementById("savedNotes");
const noteCount = document.getElementById("noteCount");
const userDisplay = document.getElementById("userDisplay");

let currentUser = null;

function createAccount() {
  const user = usernameInput.value.trim();
  const pass = passwordInput.value.trim();

  if (!user || !pass) {
    alert("Preencha os campos!");
    return;
  }

  if (localStorage.getItem(user)) {
    alert("Usuário já existe!");
  } else {
    localStorage.setItem(user, JSON.stringify({ senha: pass, lembretes: [] }));
    alert("Conta criada com sucesso!");
  }
}

function login() {
  const user = usernameInput.value.trim();
  const pass = passwordInput.value.trim();
  const data = JSON.parse(localStorage.getItem(user));

  if (data && data.senha === pass) {
    currentUser = user;
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("app").style.display = "block";
    userDisplay.innerText = user;
    noteInput.value = "";
    saveBtn.disabled = true;
    loadNotes();
  } else {
    alert("Usuário ou senha incorretos!");
  }
}

function saveNote() {
  const note = noteInput.value.trim();
  if (!note) return;

  const data = JSON.parse(localStorage.getItem(currentUser));
  data.lembretes.push(note);
  localStorage.setItem(currentUser, JSON.stringify(data));

  noteInput.value = "";
  saveBtn.disabled = true;
  loadNotes();
}

function loadNotes() {
  const data = JSON.parse(localStorage.getItem(currentUser));
  savedNotesDiv.innerHTML = "<h4>Lembretes Salvos:</h4>";
  if (!data.lembretes.length) {
    savedNotesDiv.innerHTML += "<p>Você ainda não tem lembretes.</p>";
    noteCount.innerText = "0 lembretes";
    return;
  }

  data.lembretes.forEach((txt, i) => {
    const noteHTML = document.createElement("div");
    noteHTML.classList.add("note-item");

    const noteText = document.createElement("p");
    noteText.classList.add("note-text");
    noteText.textContent = `${i + 1}. ${txt}`;

    const delBtn = document.createElement("button");
    delBtn.classList.add("delete-btn");
    delBtn.textContent = "Excluir";
    delBtn.onclick = () => deleteNote(i);

    noteHTML.appendChild(noteText);
    noteHTML.appendChild(delBtn);

    savedNotesDiv.appendChild(noteHTML);
  });

  noteCount.innerText = `${data.lembretes.length} lembrete${data.lembretes.length > 1 ? 's' : ''}`;
}

function deleteNote(index) {
  const data = JSON.parse(localStorage.getItem(currentUser));
  data.lembretes.splice(index, 1);
  localStorage.setItem(currentUser, JSON.stringify(data));
  loadNotes();
}

function clearNotes() {
  if (confirm("Tem certeza que deseja apagar todos os lembretes?")) {
    const data = JSON.parse(localStorage.getItem(currentUser));
    data.lembretes = [];
    localStorage.setItem(currentUser, JSON.stringify(data));
    loadNotes();
  }
}

function logout() {
  if (confirm("Deseja realmente sair da conta?")) {
    currentUser = null;
    document.getElementById("app").style.display = "none";
    document.getElementById("loginSection").style.display = "block";
    usernameInput.value = "";
    passwordInput.value = "";
    savedNotesDiv.innerHTML = "";
    noteCount.innerText = "";
  }
}

noteInput.addEventListener("input", () => {
  saveBtn.disabled = !noteInput.value.trim();
});
