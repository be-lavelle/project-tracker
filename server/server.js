import express from "express";
const app = express();
import cors from "cors";
import fs from 'fs/promises'
import { randomUUID } from "crypto";

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
        lines.forEach((line) => {
            if (line.startsWith("Name")) {
                newProject.name = line.split("Name: ")[1]
            }
            if (line.startsWith("Description")) {
                newProject.description = line.split("Description: ")[1]
            }
            if (line.startsWith("id")) {
                newProject.id = line.split("id: ")[1]
            }
            if (line.startsWith("---")) {
                projects.push(newProject)
                newProject = {}
            }
        })
        res.send({ projects, error: "" });
    })
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
        let projects = []
        lines.forEach((line) => {
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
            if (line.startsWith("---")) {
                projects.push({
                    name,
                    description,
                    id: currentId
                })
                name = ""
                description = ""
                currentId = 0
            }
        })
        let projectString = ""
        projects.forEach((project) => {
            projectString += `id: ${project.id}\nName: ${project.name}\nDescription: ${project.description}\n------\n`
        })
        fs.writeFile(filename, projectString, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("Saved!");
        });
    })
})

app.post('/addProject', (req, res) => {
    let id = randomUUID()
    let projectString = `id: ${randomUUID()}\nName: Name\nDescription: Description\n------\n`
    fs.appendFile(filename, projectString, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Saved!");
    });

    res.send({
        id: id,
        name: "Name",
        description: "Description"
    });
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
        let projects = []
        lines.forEach((line) => {
            if (line.startsWith("Name") && name === "") {
                name = line.split("Name: ")[1]
            }
            if (line.startsWith("Description") && description === "") {
                description = line.split("Description: ")[1]
            }
            if (line.startsWith("id")) {
                currentId = line.split("id: ")[1]
            }
            if (currentId === id) {
                name = "#toDelete"
                description = "#toDelete"
            }
            if (line.startsWith("---")) {
                projects.push({
                    name,
                    description,
                    id: currentId
                })
                name = ""
                description = ""
                currentId = 0
            }
        })
        let projectString = ""
        projects.forEach((project) => {
            if (project.name !== "#toDelete") {
                projectString += `id: ${project.id}\nName: ${project.name}\nDescription: ${project.description}\n------\n`
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