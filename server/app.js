const {Mongo, fields} = require('./db_config');
const express = require('express');
const app = express();

//CORS fixed
app.all('*', function (req, res, next) {
    // console.log('debug: ', req.method)
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-type');
    res.header(
        'Access-Control-Allow-Methods',
        'PUT,POST,GET,DELETE,OPTIONS,PATCH'
    );
    res.header('Access-Control-Max-Age', 1728000);
    next();
});

app.get('/api/all', function (req, res) {
    Mongo.find({}, fields, {sort: {cousre_id: 1}}, function (err, doc) {
        if (err) res.status(500).send('API error');
        else res.send(doc);
    });
});

app.get('/api/:many', function (req, res) {
    const many = parseInt(req.params.many, 10);
    Mongo.find({}, fields, {sort: {cousre_id: 1}, limit: many}, function (err, doc) {
        if (err) res.status(500).send('API error');
        else res.send(doc);
    });
});

app.get('/api/faculty/:fac', function (req, res) {
    const fac = req.params.fac;
    Mongo.find({faculty: fac}, fields, {sort: {cousre_id: 1}}, function (err, doc) {
        if (err) res.status(500).send('API error');
        else res.send(doc);
    });
});

app.get('/api/department/:dep', function (req, res) {
    const dep = req.params.dep;
    Mongo.find({department: dep}, fields, {sort: {cousre_id: 1}}, function (err, doc) {
        if (err) res.status(500).send('API error');
        else res.send(doc);
    });
});

app.get('/api/teacher/:name', function (req, res) {
    const name = req.params.name;
    Mongo.find({teacher: {"$regex": name, "$options": "i"}}, fields, {sort: {cousre_id: 1}}, function (err, doc) {
        if (err) res.status(500).send('API error');
        else res.send(doc);
    });
});

app.get('/api/course/:cname', function (req, res) {
    let cname = req.params.cname;
    //cname maybe has '(' and ')', so need to escape, because using regex.
    cname = cname.replace("(", "\\(");
    cname = cname.replace(")", "\\)");
    Mongo.find({course_cname: {"$regex": cname, "$options": "i"}}, fields, {sort: {cousre_id: 1}}, function (err, doc) {
        if (err) res.status(500).send('API error');
        else res.send(doc);
    });
});

app.get('/api/id/:id', function (req, res) {
    const id = req.params.id;
    Mongo.find({course_id: id}, fields, {sort: {cousre_id: 1}}, function (err, doc) {
        if (err) res.status(500).send('API error');
        else res.send(doc);
    });
});

app.get('/api/depList/:fac', function (req, res) {
    console.log('123')
    const fac = req.params.fac;
    const fields = {_id: 0, department: 1};
    Mongo.find({faculty: fac}, fields, {sort: {cousre_id: 1}}, function (err, doc) {
        if (err) res.status(500).send('API error');
        else {
            // doc convert to array
            let box = [];
            doc = doc.map(o => o.toObject());
            doc.forEach(function(value){
                box.push(value['department']);
            });
            let set = new Set(box);
            // set back to array
            set = [...set]; // set back to array
            res.send(set);
        }
    });
});

app.get('/api/teacherList/all', function (req, res) {
    const fields = {_id: 0, teacher: 1};
    Mongo.find({}, fields, {sort: {cousre_id: 1}}, function (err, doc) {
        if (err) res.status(500).send('API error');
        else {
            // doc convert to array
            let box = [];
            doc = doc.map(o => o.toObject());
            doc.forEach(function(value){
                box.push(value['teacher']);
            });
            let set = new Set(box);
            // set back to array
            set = [...set]; // set back to array
            res.send(set);
        }
    });
});

app.get('/api/courseList/all', function (req, res) {
    const fields = {_id: 0, course_cname: 1};
    Mongo.find({}, fields, {sort: {cousre_id: 1}}, function (err, doc) {
        if (err) res.status(500).send('API error');
        else {
            // doc convert to array
            let box = [];
            doc = doc.map(o => o.toObject());
            doc.forEach(function(value){
                box.push(value['course_cname']);
            });
            let set = new Set(box);
            // set back to array
            set = [...set]; // set back to array
            res.send(set);
        }
    });
});


app.listen(5488, () => {
    console.log(':web => http://127.0.0.1:5488/api');
});