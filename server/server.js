import express from "express";
const app = express();
import cors from "cors";
import fs from 'fs/promises'
import { randomUUID } from "crypto";
import { log } from "console";

app.use(cors());
app.use(express.json());
const port = 8080;

//Starting the server.

const server = app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

// File (and backup) where all the data is saved. 
const filename = "projectData.json"
const filenameBackup = "projectDataBackup.json"

// Function to handle shutdown safely
function gracefulShutdown(signal, exitCode) {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
        }
    }).then((data) => {
        try {
            const json = JSON.parse(data)
            if (json.columns) {

                fs.writeFile(filenameBackup, JSON.stringify(json), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("Saved backup!");
                }).then(() => {
                    server.close(() => {
                        console.log('Http server closed.');
                        // 3. Finally, exit the process with the designated code
                        process.exit(exitCode);
                    });
                })
            }
        } catch (error) {
            console.error('Error reading file:', error);
        }

    })
    // Force close after 10 seconds if connections are stuck
    setTimeout(() => {
        console.error('Forcing shutdown due to timeout');
        process.exit(1);
    }, 10000);
}

// Listen for system termination signals (e.g., Ctrl+C or Docker stop)
process.on('SIGINT', () => gracefulShutdown('SIGINT', 0));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM', 0));

app.get('/projectData', (req, res) => {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.send({ projects: [], error: `Error reading ${filename}` });;
        }
    }).then((data) => {
        try {
            const json = JSON.parse(data)
            res.send({ columns: json.columns, error: "" });
        } catch (error) {
            console.error('Error reading file:', err);
            res.send({ projects: [], error: `Error reading ${filename}` });;
        }

    })
});

app.get('/restore', (req, res) => {
    fs.readFile(filenameBackup, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.send({ projects: [], error: `Error reading ${filename}` });;
        }
    }).then((data) => {
        try {
            const json = JSON.parse(data)
            if (json.columns) {
                fs.writeFile(filename, JSON.stringify(json), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("Saved backup!");
                });
            }
            res.send({ columns: json.columns, error: "" });
        } catch (error) {
            console.error('Error reading file:', err);
            res.send({ projects: [], error: `Error reading ${filename}` });;
        }

    })
})

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
                let newProject = {
                    name: project.name, description: project.description, id: project.id, order: project.order,
                    "labels": []
                }
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
                let newProject = {
                    name: project.name, description: project.description, id: project.id, order: project.order,
                    "labels": []
                }
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
                    order: column.projects.length + 1,
                    "labels": []
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

app.post('/addColumn', (req, res) => {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.send({ projects: [], error: `Error reading ${filename}` });;
        }
    }).then((data) => {
        const json = JSON.parse(data)
        json.columns.push({
            name: "New List",
            id: randomUUID(),
            projects: []
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

app.post('/switchColumns', (req, res) => {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.send({ projects: [], error: `Error reading ${filename}` });;
        }
    }).then((data) => {
        const json = JSON.parse(data)
        let projectToMove = {}
        json.columns.forEach((column) => {
            let updatedProjects = []
            column.projects.forEach((project) => {
                if (project.id === req.body.id && column.name !== req.body.column) {
                    projectToMove = project
                } else {
                    updatedProjects.push(project)
                }
            })
            column.projects = updatedProjects
        })
        json.columns.forEach((column) => {
            if (column.name === req.body.column) {
                column.projects.push({
                    ...projectToMove,
                    order: column.projects.length + 1
                })
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

app.delete('/column/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.send({ projects: [], error: `Error reading ${filename}` });;
        }
    }).then((data) => {
        const json = JSON.parse(data)
        let filtered = json.columns.filter((column) => {
            return column.id !== id
        })
        json.columns = filtered
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

app.post('/label', (req, res) => {
    const id = req.body.id;
    const label = req.body.label;

    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.send({ projects: [], error: `Error reading ${filename}` });;
        }
    }).then((data) => {
        const json = JSON.parse(data)
        json.columns.forEach((column) => {
            column.projects.forEach((project) => {
                if (label !== "" && project.id === id && !project.labels.includes(label)) {
                    project.labels.push(label)
                }
            })
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

app.delete('/project/:id/label/:label', (req, res) => {
    const id = req.params.id;
    const label = req.params.label;

    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.send({ projects: [], error: `Error reading ${filename}` });;
        }
    }).then((data) => {
        const json = JSON.parse(data)
        json.columns.forEach((column) => {
            column.projects.forEach((project) => {
                if (project.id === id) {
                    project.labels = project.labels.filter((l) => {
                        return l !== label
                    })
                }

            })
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