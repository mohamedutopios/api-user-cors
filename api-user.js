const express = require('express');
const cors = require('cors'); // Importation du module CORS
const app = express();

app.use(express.json());

// Configuration CORS avec plusieurs options
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = ['http://example.com', 'http://localhost:4000']; // Liste blanche des domaines autorisés
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
  exposedHeaders: ['Content-Length', 'X-Custom-Header'], // En-têtes exposés aux clients
  credentials: true, // Permettre l'envoi de cookies et d'informations d'authentification
  optionsSuccessStatus: 204, // Statut pour les réponses OPTIONS
};

// Appliquer les options CORS globalement
app.use(cors(corsOptions));

// Version de l'API
const API_VERSION = '/v2';

// Jeu de données
let users = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', age: 30, role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', age: 25, role: 'user' },
  { id: 3, name: 'Alice Brown', email: 'alice.brown@example.com', age: 35, role: 'user' },
  { id: 4, name: 'Bob Green', email: 'bob.green@example.com', age: 40, role: 'manager' },
];

let orders = [
  { id: 1, userId: 1, total: 120.5, date: '2025-01-20' },
  { id: 2, userId: 1, total: 45.0, date: '2025-01-15' },
  { id: 3, userId: 2, total: 89.99, date: '2025-01-18' },
];

// Endpoints

// Récupérer tous les utilisateurs
app.get(`${API_VERSION}/users`, (req, res) => {
  res.status(200).json({
    success: true,
    total: users.length,
    data: users,
  });
});

// Récupérer un utilisateur par ID
app.get(`${API_VERSION}/users/:id`, (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User with ID ${userId} not found`,
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Ajouter un utilisateur
app.post(`${API_VERSION}/users`, (req, res) => {
  const { id, name, email, age, role } = req.body;

  if (!id || !name || !email || !age || !role) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: id, name, email, age, role',
    });
  }

  if (users.find((u) => u.id === id)) {
    return res.status(409).json({
      success: false,
      message: 'User with the given ID already exists',
    });
  }

  const newUser = { id, name, email, age, role };
  users.push(newUser);

  res.status(201).json({
    success: true,
    data: newUser,
  });
});

// Mettre à jour un utilisateur
app.put(`${API_VERSION}/users/:id`, (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { name, email, age, role } = req.body;

  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User with ID ${userId} not found`,
    });
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (age) user.age = age;
  if (role) user.role = role;

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Supprimer un utilisateur
app.delete(`${API_VERSION}/users/:id`, (req, res) => {
  const userId = parseInt(req.params.id, 10);

  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `User with ID ${userId} not found`,
    });
  }

  users.splice(userIndex, 1);

  res.status(204).send();
});

// Lancer le serveur
app.listen(3000, () => {
  console.log(`API ${API_VERSION} is running on http://localhost:3000`);
});
