const express = require('express');
const dotenv = require('dotenv');

const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

const app = express();

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`Request made! Host: ${req.hostname}, Path: ${req.path}, Method: ${req.method}`);
    next();
});

app.get('/', (req, res) => {
    //res.sendFile('./views/index.html', { root: __dirname });
    const sections = [
        { title: 'Dunay PRO', about: 'All You need to remember about Dunay PRO', subSections: [ { question: 'How to remove all alarms', answer: 'Connect to DB via ibExpert...', screen: null }, { question: 'Delete Sabotaj', answer: 'Connect to DB via ibExpert...', screen: null } ] },
        { title: 'Dunay XXI', about: 'All You need to remember about Dunay XXI', subSections: [ { question: 'test1', answer: 'qnsw text1...', screen: null } ] },
        { title: 'CASL Cloud', about: 'All You need to remember about CASL', subSections: [ { question: 'test2s', answer: 'answ test2...', screen: null } ] }
    ];
    res.render('index', { title: 'Main', sections });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

app.get('/sections/add', (req, res) => {
    res.render('addSection', { title: 'Add Section' });
});

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});



const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);  
});