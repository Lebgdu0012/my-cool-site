const messagesContainer = document.getElementById('messages');
const inputMessage = document.getElementById('inputMessage');

let peer;
let conn;

// Crée un Peer pour cet utilisateur
function createPeer() {
  peer = new Peer(undefined, {
    host: 'peerjs.com',
    secure: true,
    port: 443,
  });

  // Affiche l'ID Peer pour le partage
  peer.on('open', (id) => {
    console.log('Ton ID peer:', id);
    alert(`Ton ID Peer : ${id}`);
  });

  // Lorsqu'un autre Peer se connecte à nous
  peer.on('connection', (connection) => {
    conn = connection;
    setupDataChannel(conn);
  });
}

// Se connecter à un autre Peer
function connectToPeer(peerId) {
  conn = peer.connect(peerId);
  setupDataChannel(conn);
}

// Configure le canal de données
function setupDataChannel(connection) {
  connection.on('data', (data) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = `Autre utilisateur: ${data}`;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll vers le bas
  });
}

// Écoute la saisie pour envoyer des messages
inputMessage.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && inputMessage.value.trim() !== '') {
    e.preventDefault(); // Empêche le comportement par défaut

    const message = inputMessage.value; // Récupère le texte
    if (conn && conn.open) {
      conn.send(message); // Envoie via le DataChannel
    }

    // Ajoute le message localement
    const messageElement = document.createElement('div');
    messageElement.textContent = `Toi: ${message}`;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll vers le bas

    inputMessage.value = ''; // Vide le champ de saisie
  }
});

// Initialisation
createPeer();

// Demande l'ID Peer pour se connecter
const peerId = prompt('Entrez l\'ID Peer de la personne avec qui vous voulez discuter');
if (peerId) {
  connectToPeer(peerId);
}
