import './App.css'
import React from "react";
import { Accordion, AccordionSummary, Box, Button, ClickAwayListener, FormGroup, FormHelperText, Grid, NativeSelect, TextField, Typography } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import axios from 'axios';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';

type ProjectProps = {
    name: string
    description: string
    order: number
    id: number
    length: number
    columnInfo: any
    refreshList: () => void
};

export const Project = ({ name, description, id, order, length, columnInfo, refreshList }: ProjectProps) => {
    const [values, setValues] = React.useState({
        id: 0,
        name: "",
        description: "",
        order: 0
    })
    const [focused, setFocused] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    const [confirm, setConfirm] = React.useState(false);
    const [backgroundColor, setBackgroundColor] = React.useState("#fff6fe");

    React.useEffect(() => {
        setValues({
            id: id,
            name: name,
            description: description,
            order: order
        })
    }, [id, name, description, order])

    React.useEffect(() => {
        setBackgroundColor(focused ? "#f4dfef" : "#fff6fe");
    }, [focused]);

    const onExpand = (_e: any, expanded: any) => {
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

    const handleOnChangeOptions = async (event: any) => {
        const { value } = event.target;
        try {
            const response = await axios.post('http://localhost:8080/switchColumns', {
                id: values.id,
                column: value
            });
            setEdit(false)
            setFocused(false)
            refreshList()
            // Handle the successful server response
            console.log(response.data);
        } catch (error: any) {
            // Handle request errors safely
            console.error('No blep', error.response?.data || error.message);
        }
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
            refreshList()
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

    const handleUppies = async () => {
        if (values.order > 1) {
            await axios.post(`http://localhost:8080/reorder/`, { order: values.order - 1, id: values.id, direction: "uppies" }).then((_data) => {
                setEdit(false)
                setFocused(false)
            })
        }
        refreshList()
        setValues({
            ...values,
            order: values.order + 1
        })
    }

    const handleDownsies = async () => {
        if (values.order < length) {
            await axios.post(`http://localhost:8080/reorder/`, { order: values.order + 1, id: values.id, direction: "downsies" }).then((_data) => {
                setEdit(false)
                setFocused(false)
            })
        }
        refreshList()
        setValues({
            ...values,
            order: values.order + 1
        })
    }

    const dropdownOptions = columnInfo.allNames.map((name) => {
        return (
            <option value={name} key={name}>
                {name}
            </option>
        );
    });

    const dropdown = <NativeSelect defaultValue={columnInfo.name} onChange={handleOnChangeOptions} sx={{ width: "100%" }}>
        <option value={columnInfo.name} disabled hidden>{columnInfo.name}</option>

        {dropdownOptions} </NativeSelect>


    return (
        <>
            <ClickAwayListener onClickAway={() => {
                setFocused(false);
                setEdit(false);
            }} mouseEvent="onMouseDown" disableReactTree={true}>

                <Accordion
                    sx={{
                        padding: "10px",
                        margin: "20px 0",
                        borderRadius: "5px",
                        backgroundColor: backgroundColor
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
                            width: "100%", justifyContent: "center", display: "flex", backgroundColor: backgroundColor, borderBottom: focused ? "2px solid #b791ad" : "0px"
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
                    <Grid container spacing={1} sx={{ backgroundColor: backgroundColor }}>

                        {edit && <Grid size={12} sx={{ margin: "20px" }}>
                            {dropdown}
                        </Grid>}
                        <Grid size={12} sx={{ margin: "10px" }}>
                            <FormGroup>
                                <Box component="form">
                                    {!edit && <Typography sx={{ justifyContent: "left", alignItems: "center", display: "flex", padding: "10px", backgroundColor: backgroundColor, borderRadius: 2, minHeight: "40px", }}>
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
                                        sx={{ backgroundColor: backgroundColor }}
                                    />}
                                    <FormHelperText>
                                    </FormHelperText>
                                </Box>
                            </FormGroup>
                        </Grid>
                        <Grid size={2}>
                        </Grid>
                        <Grid size={2} sx={{ padding: "10px" }}>
                            <Button sx={{ padding: "6px", minWidth: "20px", backgroundColor: "#ffcbfd", color: "#644f62" }}

                                variant="contained"
                                onClick={() => { edit ? handleSave() : setEdit(true) }}
                            >
                                {!edit && <EditIcon />}
                                {edit && <SaveIcon />}
                            </Button>
                        </Grid>
                        <Grid size={2} sx={{ padding: "10px" }}>
                            <Button sx={{ padding: "6px", minWidth: "20px", backgroundColor: "#ffcbfd", color: "#644f62" }}

                                variant="contained"
                                onClick={() => { confirm ? handleDelete() : setConfirm(true) }}
                            >
                                {!confirm && <DeleteIcon />}
                                {confirm && <CheckIcon />}
                            </Button>
                        </Grid>

                        <Grid size={2} sx={{ padding: "10px" }}>
                            <Button
                                variant="contained"
                                sx={{ padding: "6px", minWidth: "20px", backgroundColor: "#ffcbfd", color: "#644f62" }}
                                onClick={handleUppies}
                                disabled={values.order < 2 || edit}
                            >
                                <ArrowUpward />
                            </Button>
                        </Grid>
                        <Grid size={2} sx={{ padding: "10px" }}>
                            <Button
                                variant="contained"
                                sx={{ padding: "6px", minWidth: "20px", backgroundColor: "#ffcbfd", color: "#644f62" }}
                                onClick={handleDownsies}
                                disabled={values.order >= length || edit}
                            >
                                <ArrowDownward />
                            </Button>
                        </Grid>
                        <Grid size={2}>
                        </Grid>
                    </Grid>
                </Accordion>
            </ClickAwayListener>
        </>
    )
}