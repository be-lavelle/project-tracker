import React, { useEffect } from 'react';
import './App.css'
import { Projects } from './Projects'
import axios from 'axios';

export const App = () => {
  const [projectData, setProjectData] = React.useState<any>({ projects: [] })

  useEffect(() => {
    axios
      .get(`http://localhost:8080/projectData`)
      .then((data) => {
        if (data.data.error === "") {
          setProjectData({
            projects: data.data.projects.sort((a: { order: number; }, b: { order: number; }) => {
              return a.order - b.order
            })
          })
        }
        console.log(data)
      });
  }, [])

  const handleAdd = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/addProject/${projectData.projects.length}`, {});
      // Handle the successful server response
      console.log(response.data);

      let projects = projectData.projects
      projects.push(response.data)
      setProjectData({
        projects: projects.sort((a: { order: number; }, b: { order: number; }) => {
          return a.order - b.order
        })
      })
    } catch (error: any) {
      // Handle request errors safely
      console.error('No blep', error.response?.data || error.message);
    }
  }

  const refreshList = () => {
    console.log("HERE")
    axios
      .get(`http://localhost:8080/projectData`)
      .then((data) => {
        if (data.data.error === "") {
          setProjectData({
            projects: data.data.projects.sort((a: { order: number; }, b: { order: number; }) => {
              return a.order - b.order
            })
          })
        }
        console.log(data)
      });
  }

  return (
    <>
      <Projects projectData={projectData.projects} handleAdd={handleAdd} refreshList={refreshList} />
    </>
  )
}