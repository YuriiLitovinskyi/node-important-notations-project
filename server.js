const express = require('express');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const Section = require('./models/section');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

const app = express();

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));  // for accepting form data
app.use(express.json({ type: ['application/json', 'text/plain'] }));

app.use((req, res, next) => {
    console.log(`Request made! Host: ${req.hostname}, Path: ${req.path}, Method: ${req.method}`);
    next();
});

app.get('/add-section', async (req, res) => {
    try {
        const section = new Section({
            title: 'New section2',
            about: 'About new section2'
        });
    
        const result = await section.save();

        res.send(result);
        
    } catch (err) {
        console.log(err);
    };
});

app.get('/', (req, res) => {
   res.redirect('/sections');
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

// sections routes
app.get('/sections', async (req, res) => {
    try {
        const allSections = await Section.find().sort({ updatedAt: -1 });

        res.render('index', { title: 'All Sections', sections: allSections });
        
    } catch (err) {
        console.log(err);
    };
});

app.post('/sections', async (req, res) => {
    try {
        const { title, about } = req.body;

        const section = new Section({ title, about });
        
        await section.save();
        
        res.redirect('/sections');
        
    } catch (err) {
        console.log(err);
    };
});

app.get('/sections/add', (req, res) => {
    res.render('addSection', { title: 'Add Section' });
});

app.get('/sections/:id', async (req, res) => {    
    try {
        const _id = req.params.id;

        const section = await Section.findById(_id);

        res.render('sectionDetails', { title: 'Single section', section });
        
    } catch (err) {
        console.log(err);
    };
});

app.delete('/sections/:id', async (req, res) => {
    try {
        const _id = req.params.id;

        await Section.findByIdAndDelete(_id);

        res.json({ redirect: '/sections' });
        
    } catch (err) {
        console.log(err);
    };
});

app.post('/subsections/:sectionId', async (req, res) => {
    try {
        const _id = req.params.sectionId;
        const { question, answer, screen } = req.body;

        const section = await Section.findById(_id);

        if(!section){
            res.redirect('/sections');
        };

        section.subSections.unshift({ question, answer, screen });
        await section.save();
    
        res.redirect(`/sections/${_id}`);

    } catch (err) {
        console.log(err);
    };
});

app.delete('/subsections', async (req, res) => {
    try {
        const sectionId = req.query.sectionId;
        const subSectionId = req.query.subSectionId;

        const section = await Section.findById(sectionId);

        section.subSections = section.subSections.filter(subSection => subSection._id != subSectionId);
        await section.save();

        res.json({ msg: 'ok' });  

    } catch (err) {
        console.log(err);
    };
});

app.put('/subsections', async (req, res) => {
    try {
        const sectionId = req.query.sectionId;
        const subSectionId = req.query.subSectionId;
        const { question, answer, screen } = req.body;
        // console.log(req.body);
        // console.log(req.query);

        const section = await Section.findById(sectionId);

        if(!section){
            res.json({ msg: 'section not found' });
        };

        // let subSection = section.subSections.find(subSection => subSection._id == subSectionId);

        // if(!subSection){
        //     res.json({ msg: 'subSection not found' });
        // };

        // subSection.set(req.body);

        // await section.save();

        // console.log(section);

        // const subSection = section.subSections.id(subSectionId);

        // if(!subSection){
        //     res.json({ msg: 'subSection not found' });
        // };

        // //subSection.set(req.body);
        // subSection.question = question;
        // subSection.answer = answer;
        // subSection.screen = screen;

        // await section.save();

        // console.log(subSection);

        

        // let subSection = section.subSections.find(subSection => subSection._id == subSectionId);
        // console.log(subSection);
        // if(!subSection){
        //     res.json({ msg: 'subSection not found' });
        // };

        // subSection.question = question;
        // subSection.answer = answer;
        // subSection.screen = screen;
        // console.log(subSection);


        // section.subSections = section.subSections.filter(subSection => subSection._id != subSectionId);
        // section.subSections.unshift({ question, answer, screen });
        // await section.save();
      

        const updatedSection = await Section.findOneAndUpdate(
            { '_id': sectionId, 'subSections._id': subSectionId  },
            {
                '$set': {
                    'subSections.$': req.body
                }
            },
            { upsert: true, new: true },
        );

       console.log(updatedSection);


        res.json({ msg: 'ok' });  

    } catch (err) {
        console.log(err);
    };
});


// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});



const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);  
});