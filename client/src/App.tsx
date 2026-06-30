import React, { useEffect } from 'react';
import './App.css'
import { Columns } from './Columns.tsx'
import axios from 'axios';

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

  const refreshList = () => {
    console.log("HERE")
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
    </>
  )
}