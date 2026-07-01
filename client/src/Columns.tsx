import axios from 'axios';
import './App.css'
import { Column } from './Column';
import Grid from '@mui/material/Grid';

type ColumnsProps = {
    columnData: any,
    refreshList: () => void
};

export const Columns = ({ columnData, refreshList }: ColumnsProps) => {
    console.log(columnData)
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

    const columns = columnData.columns.map((column) => {
        return <Column columnData={column.projects} handleAdd={handleAdd} refreshList={refreshList} columnInfo={{ id: column.id, name: column.name }} key={column.id}></Column>
    })
    return (
        <>
            <Grid container spacing={1} sx={{ paddingLeft: "10px", paddingRight: "10px" }}>
                {columns}
            </Grid>
        </>
    )
}