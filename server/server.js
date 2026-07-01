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
        res.send({ columns: json.columns, error: "" });
    })
});

app.post('/reorder', (req, res) => {
    let newOrder = req.body.order //already altered
    let uppiesOrDownsies = req.body.direction

    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.send({ projects: [], error: `Error reading ${filename}` });;
        }
    }).then((data) => {

        const json = JSON.parse(data)
        let newJson = {}
        json.columns.forEach((column) => {
            let updatedProjects = []
            column.projects.forEach((project) => {
                let newProject = { name: project.name, description: project.description, id: project.id, order: project.order }
                if (project.id === req.body.id) {
                    newProject.order = parseInt(newOrder)
                }
                if (project.order === newOrder) {
                    if (uppiesOrDownsies === "uppies") {
                        newProject.order = parseInt(newOrder) + 1
                    } else {
                        newProject.order = parseInt(newOrder) - 1
                    }
                }
                updatedProjects.push(newProject)
            })
            column.projects = updatedProjects
        })
        return JSON.stringify(json)
    }).then((jsonString) => {
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
        json.columns.forEach((column) => {
            let updatedProjects = []
            column.projects.forEach((project) => {
                let newProject = { name: project.name, description: project.description, id: project.id, order: project.order }
                if (project.id === req.body.id) {
                    newProject.name = req.body.name
                    newProject.description = req.body.description
                }
                updatedProjects.push(newProject)
            })
            column.projects = updatedProjects
        })
        return JSON.stringify(json)
    }).then((jsonString) => {
        fs.writeFile(filename, jsonString, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("Saved!");
        });
    })
    res.send({ message: "Updated" })
})

app.post('/column', (req, res) => {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.send({ projects: [], error: `Error reading ${filename}` });;
        }
    }).then((data) => {
        const json = JSON.parse(data)
        let newJson = {}
        json.columns.forEach((column) => {
            if (column.id === req.body.id) {
                column.name = req.body.name
            }
        })
        return JSON.stringify(json)
    }).then((jsonString) => {
        fs.writeFile(filename, jsonString, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("Saved!");
        });
    })
    res.send({ message: "Updated" })
})

app.post('/addProject/:columnId', (req, res) => {
    let id = req.params.columnId
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.send({ projects: [], error: `Error reading ${filename}` });;
        }
    }).then((data) => {
        const json = JSON.parse(data)
        json.columns.forEach((column) => {
            if (column.id === id) {
                const newProject = {
                    id: randomUUID(),
                    name: "NAME",
                    description: "DESCRIPTION",
                    order: column.projects.length + 1
                }
                column.projects.push(newProject)
            }
        })
        return JSON.stringify(json)
    }).then((jsonData) => {
        fs.writeFile(filename, jsonData, function (err) {
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

        json.columns.forEach((column) => {
            let filtered = []
            column.projects.forEach((project) => {
                if (project.id !== id) {
                    let updatedProject = { ...project }
                    if (project.order > order) {
                        updatedProject.order -= 1
                    }
                    filtered.push(updatedProject)
                }
            })
            column.projects = filtered
        })
        return JSON.stringify(json)
    }).then((jsonString) => {
        fs.writeFile(filename, jsonString, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("Saved!");
        });
        res.send({ message: "DELETED" });
    })
});