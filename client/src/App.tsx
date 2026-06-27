import React, { useEffect } from 'react';
import './App.css'
import { Projects } from './Projects'
import { Grid } from '@mui/material';
import axios from 'axios';

export const App = () => {
  const [projectData, setProjectData] = React.useState({ projects: [] })

  useEffect(() => {
    console.log("HEREREER")
    axios
      .get(`http://localhost:8080/projectData`)
      .then((data) => {
        if (data.data.error === "") {
          setProjectData({ projects: data.data.projects })
        }
        console.log(data)
      });
  }, [])

  return (
    <>
      <Grid container spacing={1} sx={{ paddingLeft: 4, paddingRight: 4 }}>
        <Grid
          size={{ md: 3, sm: 12 }}
          sx={{
            border: "3px #62626221",
            borderStyle: "solid",
            borderRadius: "2px",
            overflow: "auto"
          }}
        >
          <Projects projectData={projectData.projects} />
        </Grid>
      </Grid>
    </>
  )
}