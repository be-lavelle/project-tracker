import './App.css'
import React from "react";
import { Accordion, AccordionSummary, Box, Button, ClickAwayListener, FormGroup, FormHelperText, Grid, TextField, Typography } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import axios from 'axios';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';

type ProjectProps = {
    name: string
    description: string
    order: number
    id: number
    length: number
    refreshList: () => void
};

export const Project = ({ name, description, id, order, length, refreshList }: ProjectProps) => {
    const [values, setValues] = React.useState({
        id: 0,
        name: "",
        description: "",
        order: 0
    })
    const [focused, setFocused] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    const [bodyBackgroundColor, setBodyBackgroundColor] = React.useState("#ffffff");
    const [headerBackgroundColor, setHeaderBackgroundColor] = React.useState("#ffffff");

    React.useEffect(() => {
        setValues({
            id: id,
            name: name,
            description: description,
            order: order
        })
    }, [id, name, description, order])

    React.useEffect(() => {
        setBodyBackgroundColor(focused ? "#efefef" : "#ffffff");
        setHeaderBackgroundColor(focused ? "#dedede" : "#ffffff");
    }, [focused]);

    const onExpand = (e, expanded) => {
        if (expanded) {
            setFocused(true);
        } else if (edit) {
            setFocused(true);
        } else {
            setFocused(false);
        }
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        console.log(value.split("#name"))
        let newValues = { name: "", description: "", id: values.id, order: values.order }
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
                description: values.description,
                order: values.order
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
            const response = await axios.delete(`http://localhost:8080/project/${values.id}/order/${values.order}`);
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

    const handleUppies = async () => {
        if (values.order > 1) {
            await axios.post(`http://localhost:8080/reorder/`, { order: values.order - 1, id: values.id, direction: "uppies" }).then((data) => {
                setEdit(false)
                setFocused(false)

            })
        }
        refreshList()
        setValues({
            ...values,
            order
        })
    }

    const handleDownsies = async () => {
        if (values.order < length) {
            await axios.post(`http://localhost:8080/reorder/`, { order: parseInt(values.order) + 1, id: values.id, direction: "downsies" }).then((data) => {
                setEdit(false)
                setFocused(false)

            })
        }
        refreshList()
        setValues({
            ...values,
            order
        })
    }

    return (
        <>
            <ClickAwayListener onClickAway={() => {
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

                        <Grid size={3} sx={{ padding: "10px" }}>
                            <Button
                                variant="contained"
                                onClick={handleUppies}
                                disabled={values.order < 2}
                            >
                                <ArrowUpward />
                            </Button>
                        </Grid>
                        <Grid size={3} sx={{ padding: "10px" }}>
                            <Button
                                variant="contained"
                                onClick={handleDownsies}
                                disabled={values.order >= length}
                            >
                                <ArrowDownward />
                            </Button>
                        </Grid>
                        <Grid size={12} sx={{ padding: "10px" }}>
                            VALUES:{values.order}
                            ORDER:{order}
                            ID:{values.id}
                            LENGTH: {length}
                        </Grid>
                    </Grid>
                </Accordion>
            </ClickAwayListener>
        </>
    )
}