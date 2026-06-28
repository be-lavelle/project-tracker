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

const filename = "projectData.txt"
app.get('/projectData', (req, res) => {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.send({ projects: [], error: 'Error reading projectData.txt' });;
        }
    }).then((data) => {
        const lines = data.split("\n")
        let projects = []
        let newProject = {}
        lines.forEach((line, index) => {
            if (line.startsWith("Name")) {
                newProject.name = line.split("Name: ")[1]
            }
            if (line.startsWith("Description")) {
                newProject.description = line.split("Description: ")[1]
            }
            if (line.startsWith("id")) {
                newProject.id = line.split("id: ")[1]
            }
            if (line.startsWith("order")) {
                newProject.order = line.split("order: ")[1]
            }
            if (line.startsWith("---")) {
                projects.push(newProject)
                newProject = {}
            }
        })
        res.send({ projects, error: "" });
    })
});

app.post('/reorder', (req, res) => {
    let newOrder = req.body.order //already altered
    let id = req.body.id
    let uppiesOrDownsies = req.body.direction

    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.send({ projects: [], error: 'Error reading projectData.txt' });;
        }
    }).then((data) => {
        const lines = data.split("\n")
        let projects = []
        let name = ""
        let description = ""
        let currentId = 0
        let order = 0
        lines.forEach((line, index) => {

            if (line.startsWith("Name")) {
                name = line.split("Name: ")[1]
            }
            if (line.startsWith("Description")) {
                description = line.split("Description: ")[1]
            }
            if (line.startsWith("id")) {
                currentId = line.split("id: ")[1]
            }
            if (line.startsWith("order")) {
                order = Math.floor(index / 5) + 1
                if (order === newOrder) {
                    if (uppiesOrDownsies === "uppies") {
                        order = parseInt(newOrder) + 1
                    } else {
                        order = parseInt(newOrder) - 1
                    }
                }
            }
            if (line.startsWith("---")) {
                let updatedProject = {
                    name,
                    description,
                }
                if (currentId === id) {
                    updatedProject = {
                        ...updatedProject,
                        id,
                        order: newOrder
                    }
                } else {
                    updatedProject = {
                        ...updatedProject,
                        id: currentId,
                        order
                    }
                }
                projects.push(updatedProject)
            }
        })
        let projectString = ""
        projects.forEach((project) => {
            projectString += `id: ${project.id}\nName: ${project.name}\nDescription: ${project.description}\norder: ${project.order}\n------\n`
        })
        fs.writeFile(filename, projectString, function (err) {
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
            res.send({ projects: [], error: 'Error reading projectData.txt' });;
        }
    }).then((data) => {
        const lines = data.split("\n")
        let name = ""
        let description = ""
        let currentId = 0
        let order = 0
        let projects = []
        lines.forEach((line, index) => {
            if (line.startsWith("Name") && name === "") {
                name = line.split("Name: ")[1]
            }
            if (line.startsWith("Description") && description === "") {
                description = line.split("Description: ")[1]
            }
            if (line.startsWith("id")) {
                currentId = line.split("id: ")[1]
            }
            if (currentId === req.body.id) {
                name = req.body.name
                description = req.body.description
            }
            if (line.startsWith("order")) {
                order = Math.floor(index / 5) + 1
            }
            if (line.startsWith("---")) {
                projects.push({
                    name,
                    description,
                    order,
                    id: currentId
                })
                name = ""
                description = ""
                currentId = 0
                order = 0
            }
        })
        let projectString = ""
        projects.forEach((project) => {
            projectString += `id: ${project.id}\nName: ${project.name}\nDescription: ${project.description}\norder: ${project.order}\n------\n`
        })
        fs.writeFile(filename, projectString, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("Saved!");
        });
    })
    res.send({ message: "Updated" })
})

app.post('/addProject/:length', (req, res) => {
    let id = randomUUID()
    let length = req.params.length
    let projectString = `id: ${id}\nName: Name\nDescription: Description\norder: ${parseInt(length) + 1}\n------\n`
    fs.appendFile(filename, projectString, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Saved!");
    }).then(() => {
        res.send({
            id: id,
            name: "Name",
            description: "Description",
            order: length
        });
    })
});

app.post('/project/:id', (req, res) => {
    const id = req.params.id;

    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.send({ projects: [], error: 'Error reading projectData.txt' });;
        }
    }).then((data) => {
        const lines = data.split("\n")
        let name = ""
        let description = ""
        let currentId = 0
        let order = 0
        let projects = []
        let orderToDelete = 1000000000
        lines.forEach((line, index) => {
            if (line.startsWith("Name") && name === "") {
                name = line.split("Name: ")[1]
            }
            if (line.startsWith("Description") && description === "") {
                description = line.split("Description: ")[1]
            }
            if (line.startsWith("id")) {
                currentId = line.split("id: ")[1]
            }
            if (line.startsWith("order")) {
                order = Math.floor(index / 5) + 1
                if (order > orderToDelete) {
                    order -= 1
                }
            }
            if (currentId === id) {
                name = "#toDelete"
                description = "#toDelete"
                orderToDelete = Math.floor(index / 5) + 1
            }
            if (line.startsWith("---")) {
                projects.push({
                    name,
                    description,
                    id: currentId,
                    order: order
                })
                name = ""
                description = ""
                currentId = 0
                order = 0
            }
        })
        let projectString = ""
        projects.forEach((project) => {
            if (project.name !== "#toDelete") {
                projectString += `id: ${project.id}\nName: ${project.name}\nDescription: ${project.description}\norder: ${project.order}\n------\n`
            }
        })
        fs.writeFile(filename, projectString, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("Saved!");
        });
        res.send(`Deleted ${id}`)
    })
});