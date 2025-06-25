const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const multer = require('multer');

const app = express();

// Setup multer (no disk storage needed)
const upload = multer({
    storage: multer.memoryStorage(), // we won’t save files
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
});

// Middleware to parse form data (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Optional: if you want to parse JSON as well
app.use(express.json());

// POST endpoint
app.post('/contact/send-message', upload.single('projectDesign'), (req, res) => {
    // res.json(req.body); // Send the received data back as JSON
    const { author, sender, title, message } = req.body;
    const file = req.file;

    if (author && sender && title && message && file) {
        // All fields are filled
        res.render('contact', {
            isSent: true,
            fileName: file.originalname
        });
    } else {
        // At least one field is empty
        res.render('contact', { isError: true });
    }
});

app.engine('hbs', hbs({
    extname: 'hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    defaultLayout: 'main'
}));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/hello/:name', (req, res) => {
    res.render('hello', { name: req.params.name });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/info', (req, res) => {
    res.render('info');
});

app.get('/history', (req, res) => {
    res.render('history');
});

app.use((req, res) => {
    res.status(404).send('404 not found...');
});

app.listen(8000, () => {
    console.log('Server is running on port: 8000');
});
