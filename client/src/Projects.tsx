import './App.css'
import { Project } from './Project';

type FormInputProps = {
    projectData: any
};

export const Projects = ({ projectData }: FormInputProps) => {
    if (!projectData) {
        return <></>
    }
    const projects = projectData.map((project: any) => {
        return <Project name={project.name} description={project.description} id={project.id} />
    })

    return (
        <>
            {projects}
        </>
    )
}