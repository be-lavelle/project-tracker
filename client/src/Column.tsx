import { Button, ClickAwayListener, Grid, TextField, Typography } from '@mui/material';
import './App.css'
import { Project } from './Project';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import React from 'react';
import axios from 'axios';

type ColumnProps = {
    columnData: any,
    columnInfo: any,
    handleAdd: any,
    refreshList: () => void
};

export const Column = ({ columnData, handleAdd, refreshList, columnInfo }: ColumnProps) => {
    console.log(columnData)
    const [edit, setEdit] = React.useState(false);
    const [name, setName] = React.useState("");
    const [allNames, setAllNames] = React.useState([]);
    const [confirm, setConfirm] = React.useState(false);

    React.useEffect(() => {
        setName(columnInfo.name)
        setAllNames(columnInfo.allNames)
    }, [columnInfo])

    if (!columnData) {
        return <></>
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setName(value);
    };

    const handleSave = async () => {
        try {
            const response = await axios.post('http://localhost:8080/column', {
                name: name,
                id: columnInfo.id
            });
            setEdit(false)
            setConfirm(false)
            refreshList()
            // Handle the successful server response
            console.log(response.data);
        } catch (error: any) {
            // Handle request errors safely
            console.error('No blep', error.response?.data || error.message);
        }
    }

    const handleDeleteColumn = async () => {
        try {
            const response = await axios.delete(`http://localhost:8080/column/${columnInfo.id}`);
            setEdit(false)
            setConfirm(false)
            refreshList()
            // Handle the successful server response
            console.log(response.data);
        } catch (error: any) {
            // Handle request errors safely
            console.error('No blep', error.response?.data || error.message);
        }
    }

    let projects = columnData.sort((a: { order: number; }, b: { order: number; }) => {
        return a.order - b.order
    }).map((project: any) => {
        return <Project key={project.id} name={project.name} columnInfo={columnInfo} description={project.description} id={project.id} order={project.order} length={columnData.length} refreshList={refreshList} />
    })



    return (
        <>
            <ClickAwayListener onClickAway={() => {
                setEdit(false);
                setConfirm(false)
            }} mouseEvent="onMouseDown" disableReactTree={true}>
                <Grid
                    size={{ md: 4, sm: 12 }}
                    sx={{
                        border: "3px #62626221",
                        borderStyle: "solid",
                        borderRadius: "2px",
                        overflow: "auto",
                        padding: "10px",
                        backgroundColor: "#ffedf9"
                    }}
                >
                    <Grid container spacing={1}>
                        <Grid size={8} sx={{ display: "flex", justifyContent: "left", alignItems: "center", padding: "10px" }}>
                            {!edit && <Typography variant="h5" >{columnInfo.name}</Typography>}
                            {edit && <TextField
                                name={"#columnName" + columnInfo.name}
                                value={name}
                                onChange={onChange}
                                placeholder="column"
                                label="column"
                                fullWidth
                            />}</Grid>
                        <Grid size={4}>
                            <Grid container spacing={1}>
                                <Grid size={6}>
                                    <Button sx={{ margin: "10px", padding: "6px", minWidth: "20px", backgroundColor: "#ffcbfd", color: "#644f62" }}

                                        variant="contained"
                                        onClick={() => { edit ? handleSave() : setEdit(true) }}
                                    >
                                        {!edit && <EditIcon />}
                                        {edit && <SaveIcon />}
                                    </Button>
                                </Grid>
                                <Grid size={6}>
                                    <Button sx={{ margin: "10px", padding: "6px", minWidth: "20px", backgroundColor: "#ffcbfd", color: "#644f62" }}

                                        variant="contained"
                                        onClick={() => { confirm ? handleDeleteColumn() : setConfirm(true) }}
                                    >
                                        {!confirm && <DeleteIcon />}
                                        {confirm && <CheckIcon />}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    {projects}
                    <Button
                        sx={{ margin: "10px", padding: "6px", minWidth: "20px", backgroundColor: "#ffcbfd", color: "#644f62" }}

                        variant="contained"
                        onClick={() => { handleAdd(columnInfo.id) }}
                    >
                        <AddIcon />
                    </Button>
                </Grid>
            </ClickAwayListener>
        </>
    )
}