import React, { useEffect } from 'react';
import './App.css'
import { Columns } from './Columns.tsx'
import axios from 'axios';
import Button from '@mui/material/Button';

export const App = () => {
  const [columns, setColumns] = React.useState<any>({})
  useEffect(() => {
    axios
      .get(`http://localhost:8080/projectData`)
      .then((data) => {
        if (data.data.error === "" && data.data.columns) {
          setColumns({ columns: data.data.columns })
        }
      });
  }, [])

  const handleRestore = () => {
    axios
      .get(`http://localhost:8080/restore`)
      .then((data) => {
        if (data.data.error === "") {
          setColumns({ columns: data.data.columns })
        }
        console.log(data)
      });
  }

  const refreshList = () => {
    axios
      .get(`http://localhost:8080/projectData`)
      .then((data) => {
        if (data.data.error === "") {
          setColumns({ columns: data.data.columns })
        }
        console.log(data)
      });
  }

  return (
    <>
      {<Columns columnData={columns} refreshList={refreshList}></Columns>}
      <Button
        sx={{ margin: "10px", padding: "6px", minWidth: "20px", backgroundColor: "#ffcbfd", color: "#644f62" }}

        variant="contained"
        onClick={() => { handleRestore() }}
      >
        Restore from Backup
      </Button>
    </>
  )
}