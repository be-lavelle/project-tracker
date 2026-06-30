import axios from 'axios';
import './App.css'
import { Column } from './Column';

type ColumnsProps = {
    columnData: any,
    refreshList: () => void
};

export const Columns = ({ columnData, refreshList }: ColumnsProps) => {
    if (!columnData || !columnData.columns) {
        return <></>
    }
    const handleAdd = async (columnName: string) => {
        try {
            const response = await axios.post(`http://localhost:8080/addProject/${columnName}`, {});
            // Handle the successful server response
            console.log(response.data);
        } catch (error: any) {
            // Handle request errors safely
            console.error('No blep', error.response?.data || error.message);
        }
    }

    const columns = Object.keys(columnData.columns).map((key) => {
        return <Column columnData={columnData.columns[key]} handleAdd={handleAdd} refreshList={refreshList} columnName={key} key={key}></Column>
    })
    return (
        <>
            {columns}
        </>
    )
}