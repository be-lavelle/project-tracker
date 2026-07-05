import './App.css'
import React from "react";
import { Accordion, AccordionSummary, Autocomplete, Box, Button, Chip, ClickAwayListener, createFilterOptions, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup, FormHelperText, Grid, NativeSelect, TextField, Typography } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';

type ProjectProps = {
    name: string
    description: string
    order: number
    id: number
    projectLabels: any
    length: number
    columnInfo: any
    refreshList: () => void
};

const filter = createFilterOptions();

export const Project = ({ name, description, id, order, length, projectLabels, columnInfo, refreshList }: ProjectProps) => {
    const [values, setValues] = React.useState({
        id: 0,
        name: "",
        description: "",
        order: 0
    })
    const [focused, setFocused] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    const [confirm, setConfirm] = React.useState(false);
    const [labels, setLabels] = React.useState([]);
    const [backgroundColor, setBackgroundColor] = React.useState("#fff6fe");
    const [autocompleteValue, setAutocompleteValue] = React.useState("")
    const [dialogValue, setDialogValue] = React.useState("")
    const [openDialog, setOpenDialog] = React.useState(false)

    React.useEffect(() => {
        setValues({
            id: id,
            name: name,
            description: description,
            order: order
        })
        setLabels(projectLabels)
    }, [id, name, description, order, projectLabels])

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

    const handleDeleteLabel = async (labelToDelete: string) => {
        try {
            const response = await axios.delete(`http://localhost:8080/project/${values.id}/label/${labelToDelete}`);
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

    const handleCloseDialog = () => {
        setDialogValue("");
        setAutocompleteValue("");
        setOpenDialog(false);
    };

    const handleSubmitDialog = async (event) => {
        event.preventDefault();
        setAutocompleteValue(dialogValue);
        try {
            const response = await axios.post(`http://localhost:8080/label`, {
                label: dialogValue,
                id: values.id
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
        handleCloseDialog();
    };

    const dropdown = <NativeSelect defaultValue={columnInfo.name} onChange={handleOnChangeOptions} sx={{ width: "100%" }}>
        <option value={columnInfo.name} disabled hidden>{columnInfo.name}</option>
        {dropdownOptions}
    </NativeSelect>

    const displayLabels = labels.map((label) => {
        return <Chip label={label} onDelete={() => { handleDeleteLabel(label) }} sx={{ margin: "10px" }} />
    })

    displayLabels.push(<Chip icon={<AddIcon sx={{ display: "flex" }} />} label="Add label" onClick={() => { setOpenDialog(true) }} sx={{ margin: "10px", display: "flex", justifyContent: "center", alignItems: "center" }} />)

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
                        <Grid size={12}>
                            {displayLabels}
                        </Grid>
                        {edit && <Grid size={12} sx={{ margin: "0 20px 10px" }}>
                            {dropdown}
                        </Grid>}
                        <Grid size={12}>
                            <FormGroup>
                                <Box component="form">
                                    {!edit && <Typography sx={{ justifyContent: "left", alignItems: "center", display: "flex", padding: "0 10px", backgroundColor: backgroundColor, borderRadius: 2, minHeight: "40px", }}>
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
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <form onSubmit={handleSubmitDialog}>
                    <DialogTitle>Add label</DialogTitle>
                    <DialogContent>
                        <Autocomplete
                            value={autocompleteValue}
                            onChange={(event, newValue) => {
                                if (typeof newValue === 'string') {
                                    setDialogValue(newValue);
                                } else if (newValue && newValue.inputValue) {
                                    setDialogValue(newValue.inputValue);
                                } else {
                                    setAutocompleteValue(newValue)
                                }
                            }}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);

                                if (params.inputValue !== '' && !columnInfo.allLabels.includes(params.inputValue)) {
                                    filtered.push(`${params.inputValue}`);
                                }

                                return filtered;
                            }}
                            id="free-solo-dialog-demo"
                            options={columnInfo.allLabels}
                            getOptionLabel={(option) => {
                                // for example value selected with enter, right from the input
                                if (typeof option === 'string') {
                                    return option;
                                }
                                if (option.inputValue) {
                                    return option.inputValue;
                                }
                                return option;
                            }}
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            isOptionEqualToValue={(option, value) => option === value}
                            renderOption={(props, option) => {
                                const { key, ...optionProps } = props;
                                return (
                                    <li key={key} {...optionProps}>
                                        {option}
                                    </li>
                                );
                            }}
                            sx={{ width: 300 }}
                            freeSolo
                            resetHighlightOnMouseLeave
                            renderInput={(params) => <TextField {...params} label="Add label" onKeyDown={(event) => { if (event.key === 'enter') { handleSubmitDialog() } }} />}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button type="submit">Add</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}