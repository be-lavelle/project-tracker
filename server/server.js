import express from "express";
const app = express();
import cors from "cors";
import fs from 'fs/promises'
import { randomUUID } from "crypto";
import { log } from "console";

app.use(cors());
app.use(express.json());
const port = 8080;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

const filename = "projectData.json"
app.get('/projectData', (req, res) => {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.send({ projects: [], error: `Error reading ${filename}` });;
        }
    }).then((data) => {
        const json = JSON.parse(data)
        res.send({ projects: json, error: "" });
    })
});

app.post('/reorder', (req, res) => {
    let newOrder = req.body.order //already altered
    let id = req.body.id
    let uppiesOrDownsies = req.body.direction

    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.send({ projects: [], error: `Error reading ${filename}` });;
        }
    }).then((data) => {
        const json = JSON.parse(data)
        const reorderedProjects = []
        json.forEach((project) => {
            let newProject = { name: project.name, description: project.description, id: project.id, order: project.order }
            if (project.id === id) {
                newProject.order = parseInt(newOrder)
            }
            if (project.order === newOrder) {
                if (uppiesOrDownsies === "uppies") {
                    newProject.order = parseInt(newOrder) + 1
                } else {
                    newProject.order = parseInt(newOrder) - 1
                }
            }
            reorderedProjects.push(newProject)
        })
        let jsonString = JSON.stringify(reorderedProjects)
        fs.writeFile(filename, jsonString, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("Saved!");
        });
    })
    res.send({ message: "Re-ordered", error: "" });
});

app.post('/project', (req, res) => {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.send({ projects: [], error: `Error reading ${filename}` });;
        }
    }).then((data) => {
        const json = JSON.parse(data)
        const reorderedProjects = []
        json.forEach((project) => {
            let newProject = { name: project.name, description: project.description, id: project.id, order: project.order }
            if (project.id === req.body.id) {
                newProject.name = req.body.name
                newProject.description = req.body.description
            }
            reorderedProjects.push(newProject)
        })
        let jsonString = JSON.stringify(reorderedProjects)
        fs.writeFile(filename, jsonString, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("Saved!");
        });
    })
    res.send({ message: "Updated" })
})

app.post('/addProject/:length', (req, res) => {
    let length = req.params.length
    const newProject = {
        id: randomUUID(),
        name: "NAME",
        description: "DESCRIPTION",
        order: parseInt(length) + 1
    }
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.send({ projects: [], error: `Error reading ${filename}` });;
        }
    }).then((data) => {
        const json = JSON.parse(data)
        json.push(newProject)
        let jsonString = JSON.stringify(json)
        fs.writeFile(filename, jsonString, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("Saved!");
        });
    })
    res.send(newProject)

});

app.delete('/project/:id/order/:order', (req, res) => {
    const id = req.params.id;
    const order = req.params.order;

    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.send({ projects: [], error: `Error reading ${filename}` });;
        }
    }).then((data) => {
        const json = JSON.parse(data)
        const filtered = []
        json.forEach((project) => {
            if (project.id !== id) {
                let updatedProject = { ...project }
                if (project.order > order) {
                    updatedProject.order -= 1
                }
                filtered.push(updatedProject)
            }
        })
        let jsonString = JSON.stringify(filtered)
        fs.writeFile(filename, jsonString, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("Saved!");
        });
        res.send(`Deleted ${id}`)
    })
});