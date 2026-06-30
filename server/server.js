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
        res.send({ columns: json, error: "" });
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
        let newJson = {}
        Object.keys(json).forEach((column) => {
            let reorderedProjects = []
            json[column].forEach((project) => {
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
            newJson[column] = reorderedProjects
        })

        let jsonString = JSON.stringify(newJson)
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
        let newJson = {}
        Object.keys(json).forEach((column) => {
            let updatedProjects = []
            json[column].forEach((project) => {
                let newProject = { name: project.name, description: project.description, id: project.id, order: project.order }
                if (project.id === req.body.id) {
                    newProject.name = req.body.name
                    newProject.description = req.body.description
                }
                updatedProjects.push(newProject)
            })
            newJson[column] = updatedProjects
        })
        let jsonString = JSON.stringify(newJson)
        fs.writeFile(filename, jsonString, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("Saved!");
        });
    })
    res.send({ message: "Updated" })
})

app.post('/addProject/:columnName', (req, res) => {
    let column = req.params.columnName
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.send({ projects: [], error: `Error reading ${filename}` });;
        }
    }).then((data) => {
        const json = JSON.parse(data)
        console.log(column)
        const columnToAddTo = json[column]
        const newProject = {
            id: randomUUID(),
            name: "NAME",
            description: "DESCRIPTION",
            order: columnToAddTo.length + 1
        }
        columnToAddTo.push(newProject)
        let jsonString = JSON.stringify(json)
        fs.writeFile(filename, jsonString, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("Saved!");
        });
    })
    res.send({ message: "Added" })

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
        let newJson = {}
        Object.keys(json).forEach((column) => {
            let filtered = []
            json[column].forEach((project) => {
                if (project.id !== id) {
                    let updatedProject = { ...project }
                    if (project.order > order) {
                        updatedProject.order -= 1
                    }
                    filtered.push(updatedProject)
                }
            })
            newJson[column] = filtered
        })
        let jsonString = JSON.stringify(newJson)
        fs.writeFile(filename, jsonString, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("Saved!");
        });
        res.send(`Deleted ${id}`)
    })
});