import './App.css'
import React from "react";
import { Accordion, AccordionSummary, Box, Button, ClickAwayListener, FormGroup, FormHelperText, Grid, TextField, Typography } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import axios from 'axios';

type ProjectProps = {
    name: string
    description: string,
    id: number
    refreshList: () => void
};

export const Project = ({ name, description, id, refreshList }: ProjectProps) => {
    const [values, setValues] = React.useState({
        id: 0,
        name: "",
        description: ""
    })
    const [focused, setFocused] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    const [bodyBackgroundColor, setBodyBackgroundColor] = React.useState("#ffffff");
    const [headerBackgroundColor, setHeaderBackgroundColor] = React.useState("#ffffff");

    React.useEffect(() => {
        setValues({
            id: id,
            name: name,
            description: description
        })
    }, [])

    React.useEffect(() => {
        setBodyBackgroundColor(focused ? "#efefef" : "#ffffff");
        setHeaderBackgroundColor(focused ? "#dedede" : "#ffffff");
    }, [focused]);

    const onExpand = (e, expanded) => {
        if (expanded) {
            setFocused(true);
        } else if (edit) {
            handleSave();
            setFocused(false);
        } else {
            handleSave();
            setFocused(false);
        }
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        console.log(value.split("#name"))
        let newValues = { name: "", description: "", id: values.id }
        if (name.startsWith("#name")) {
            newValues = {
                ...values,
                name: value.split("#name")[0],
            };
        } else if (name.startsWith("#description")) {
            newValues = {
                ...values,
                description: value.split("#description")[0],
            };
        }

        setValues({ ...newValues });
    };

    const handleSave = async () => {
        console.log(values)
        try {
            const response = await axios.post('http://localhost:8080/project', {
                id: values.id,
                name: values.name,
                description: values.description
            });
            setEdit(false)
            setFocused(false)
            // Handle the successful server response
            console.log(response.data);
        } catch (error: any) {
            // Handle request errors safely
            console.error('No blep', error.response?.data || error.message);
        }
    }

    const handleDelete = async () => {
        try {
            const response = await axios.post(`http://localhost:8080/project/${values.id}`);
            setEdit(false)
            setFocused(false)
            refreshList()
            // Handle the successful server response
            console.log(response.data);
        } catch (error: any) {
            // Handle request errors safely
            console.error('No blep', error.response?.data || error.message);
        }
    }

    const handleEdit = () => {
        setEdit(true)
    }

    return (
        <>
            <ClickAwayListener onClickAway={() => {
                handleSave()
                setFocused(false);
                setEdit(false)
            }} mouseEvent="onMouseDown" disableReactTree={true}>

                <Accordion
                    sx={{
                        padding: "10px",
                    }}
                    slotProps={{ transition: { unmountOnExit: true } }}
                    onChange={onExpand}
                    expanded={focused}
                    disableGutters
                >
                    <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                        sx={{
                            width: "100%", justifyContent: "center", display: "flex", backgroundColor: headerBackgroundColor,
                        }}
                    >
                        {!edit && <Typography>
                            {values.name}
                        </Typography>}
                        {edit && <TextField
                            name={"#name" + name}
                            value={values.name}
                            onChange={onChange}
                            placeholder="project"
                            label="project"
                            fullWidth
                        />}
                    </AccordionSummary>
                    <Grid container spacing={1} sx={{ backgroundColor: bodyBackgroundColor }}>
                        <Grid size={12} sx={{ margin: "10px" }}>
                            <FormGroup>
                                <Box component="form">
                                    {!edit && <Typography>
                                        {values.description}
                                    </Typography>}
                                    {edit && <TextField
                                        name={"#description" + name}
                                        value={values.description}
                                        onChange={onChange}
                                        placeholder="project"
                                        label="project"
                                        fullWidth
                                        multiline
                                        rows={4}
                                    />}
                                    <FormHelperText>
                                    </FormHelperText>
                                </Box>
                            </FormGroup>
                        </Grid>
                        <Grid size={6} sx={{ padding: "10px" }}>
                            <Button
                                variant="contained"
                                onClick={handleEdit}
                            >
                                Edit
                            </Button>
                        </Grid>

                        <Grid size={6} sx={{ padding: "10px" }}>
                            <Button
                                variant="contained"
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                        </Grid>
                        <Grid size={6} sx={{ padding: "10px" }}>
                            <Button
                                variant="contained"
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                        </Grid>

                        <Grid size={6} sx={{ padding: "10px" }}>
                            <Button
                                variant="contained"
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                        </Grid>

                    </Grid>
                </Accordion>
            </ClickAwayListener>
        </>
    )
}