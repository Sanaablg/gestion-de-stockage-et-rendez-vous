const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const userRoute = require('./routes/userRoute');
const isAuthenticated = require('./middleware/auth');
const connectDB = require('./config/conn'); // Ensure the path is correct

dotenv.config({ path: './config/.env' });

connectDB(); // Connect to the database

app.use(express.json());
app.use(cookieParser());
app.use('/auth', userRoute);

const PORT1 = process.env.PORT1 || 3000;

// Read equipes.json file
const equipesPath = path.join(__dirname, 'equipes.json');
let equipes = [];

try {
    const data = fs.readFileSync(equipesPath, 'utf8');
    equipes = JSON.parse(data);
} catch (error) {
    console.error('Error reading equipes.json:', error);
}

// Read entraineur.json file
const entraineurPath = path.join(__dirname, 'entraineur.json');
let entraineurs = [];

try {
    const data = fs.readFileSync(entraineurPath, 'utf8');
    entraineurs = JSON.parse(data);
} catch (error) {
    console.error('Error reading entraineur.json:', error);
}

app.get('/', (req, res) => {
    res.json({ 'message': "Documentation du API" });
});

// Equipes Routes
app.get('/equipes', isAuthenticated, (req, res) => {
    res.json(equipes);
});

app.post('/equipes', isAuthenticated, (req, res) => {
    const newEquipe = req.body;
    equipes.push(newEquipe);

    // Save the updated equipes array back to equipes.json
    fs.writeFileSync(equipesPath, JSON.stringify(equipes, null, 2), 'utf8');
    res.json({ 'message': "Equipe added successfully" });
});

app.get('/equipes/:id', isAuthenticated, (req, res) => {
    const id = parseInt(req.params.id);
    const equipe = equipes.find(equipe => equipe.id === id);
    if (equipe) {
        res.json(equipe);
    } else {
        res.status(404).json({ 'message': "Equipe not found" });
    }
});

app.delete('/equipes/:id', isAuthenticated, (req, res) => {
    const id = parseInt(req.params.id);
    const index = equipes.findIndex(equipe => equipe.id === id);
    if (index !== -1) {
        equipes.splice(index, 1);

        // Save the updated equipes array back to equipes.json
        fs.writeFileSync(equipesPath, JSON.stringify(equipes, null, 2), 'utf8');
        res.json({ 'message': "Equipe deleted successfully" });
    } else {
        res.status(404).json({ 'error': "Equipe not found" });
    }
});

// Entraineurs Routes
app.get('/entraineurs', isAuthenticated, (req, res) => {
    res.json(entraineurs);
});

app.post('/entraineurs', isAuthenticated, (req, res) => {
    const newEntraineur = req.body;
    entraineurs.push(newEntraineur);

    // Save the updated entraineurs array back to entraineur.json
    fs.writeFileSync(entraineurPath, JSON.stringify(entraineurs, null, 2), 'utf8');
    res.json({ 'message': "Entraineur added successfully" });
});

app.get('/entraineurs/:id', isAuthenticated, (req, res) => {
    const id = parseInt(req.params.id);
    const entraineur = entraineurs.find(entraineur => entraineur.id === id);
    if (entraineur) {
        res.json(entraineur);
    } else {
        res.status(404).json({ 'message': "Entraineur not found" });
    }
});

app.put('/entraineurs/:id', isAuthenticated, (req, res) => {
    const id = parseInt(req.params.id);
    const index = entraineurs.findIndex(entraineur => entraineur.id === id);
    if (index !== -1) {
        entraineurs[index] = req.body;

        // Save the updated entraineurs array back to entraineur.json
        fs.writeFileSync(entraineurPath, JSON.stringify(entraineurs, null, 2), 'utf8');
        res.json({ 'message': "Entraineur updated successfully" });
    } else {
        res.status(404).json({ 'message': "Entraineur not found" });
    }
});

app.delete('/entraineurs/:id', isAuthenticated, (req, res) => {
    const id = parseInt(req.params.id);
    const index = entraineurs.findIndex(entraineur => entraineur.id === id);
    if (index !== -1) {
        entraineurs.splice(index, 1);

        // Save the updated entraineurs array back to entraineur.json
        fs.writeFileSync(entraineurPath, JSON.stringify(entraineurs, null, 2), 'utf8');
        res.json({ 'message': "Entraineur deleted successfully" });
    } else {
        res.status(404).json({ 'message': "Entraineur not found" });
    }
});

// Relation between Entraineur and Equipe
app.get('/entraineurs/:id/equipe', isAuthenticated, (req, res) => {
    const id = parseInt(req.params.id);
    const entraineur = entraineurs.find(entraineur => entraineur.id === id);
    if (entraineur) {
        const equipe = equipes.find(equipe => equipe.name === entraineur.team);
        if (equipe) {
            res.json(equipe);
        } else {
            res.status(404).json({ 'message': "Equipe not found for this entraineur" });
        }
    } else {
        res.status(404).json({ 'message': "Entraineur not found" });
    }
});

app.listen(PORT1, () => {
    console.log(`Server started on port ${PORT1}`);
});
