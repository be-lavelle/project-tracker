import axios from 'axios';
import './App.css'
import { Column } from './Column';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';


type ColumnsProps = {
    columnData: any,
    refreshList: () => void
};

export const Columns = ({ columnData, refreshList }: ColumnsProps) => {
    if (!columnData || !columnData.columns) {
        return <></>
    }
    const handleAdd = async (columnId: string) => {
        try {
            await axios.post(`http://localhost:8080/addProject/${columnId}`, {}).then((response) => {
                refreshList()
                console.log(response.data);

            });
            // Handle the successful server response
        } catch (error: any) {
            // Handle request errors safely
            console.error('No blep', error.response?.data || error.message);
        }
    }

    const handleAddColumn = async () => {
        try {
            await axios.post(`http://localhost:8080/addColumn`, {}).then((response) => {
                refreshList()
                console.log(response.data);

            });
            // Handle the successful server response
        } catch (error: any) {
            // Handle request errors safely
            console.error('No blep', error.response?.data || error.message);
        }
    }

    const allNames = columnData.columns.map((column) => { return column.name })
    let allLabels: any[] = []

    columnData.columns.forEach((column) => {
        column.projects.forEach((project) => {
            project.labels.forEach((label) => {
                if (!allLabels.includes(label)) {
                    allLabels.push(label)
                }
            })
        })
    })

    const columns = columnData.columns.map((column) => {
        return <Column columnData={column.projects} handleAdd={handleAdd} refreshList={refreshList} columnInfo={{ id: column.id, name: column.name, allNames: allNames, allLabels: allLabels }} key={column.id}></Column>
    })
    return (
        <>
            <Grid container spacing={1} sx={{ paddingLeft: "10px", paddingRight: "10px" }}>
                {columns}
                <Button
                    sx={{ margin: "10px", padding: "6px", minWidth: "20px", backgroundColor: "#ffcbfd", color: "#644f62" }}

                    variant="contained"
                    onClick={() => { handleAddColumn() }}
                >
                    <AddIcon />
                </Button>
            </Grid>
        </>
    )
}