import './App.css'
import React from "react";
import { Accordion, AccordionSummary, Box, Button, ClickAwayListener, FormGroup, FormHelperText, Grid, TextField, Typography } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import axios from 'axios';

type ProjectProps = {
    name: string
    description: string,
    id: number
};

export const Project = ({ name, description, id }: ProjectProps) => {
    const [values, setValues] = React.useState({
        id: 0,
        name: "",
        description: ""
    })
    const [focused, setFocused] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    const [backgroundColor, setBackgroundColor] = React.useState("#ffffff");

    React.useEffect(() => {
        setValues({
            id: id,
            name: name,
            description: description
        })
    }, [])

    React.useEffect(() => {
        setBackgroundColor(focused ? "#d5d5d5" : "#ffffff");
    }, [focused]);

    const onExpand = (e, expanded) => {
        if (expanded) {
            setFocused(true);
        } else if (edit) {
            handleSave();
            setFocused(false);
        } else {
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
                if (focused) {
                    setFocused(false);
                }
                setEdit(false)
            }} mouseEvent="onMouseDown" disableReactTree={true}>

                <Accordion
                    sx={{
                        mb: 0,
                        width: "100%",
                        backgroundColor: backgroundColor,
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
                        sx={{ width: "100%", justifyContent: "center", display: "flex" }}
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
                    <Grid container spacing={1}>
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

                            <Button
                                variant="contained"
                                onClick={handleEdit}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                        </FormGroup>
                    </Grid>
                </Accordion>
            </ClickAwayListener>
        </>
    )
}