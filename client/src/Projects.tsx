import { Button, Grid } from '@mui/material';
import './App.css'
import { Project } from './Project';

type FormInputProps = {
    projectData: any,
    handleAdd: () => {}
    refreshList: () => void
};

export const Projects = ({ projectData, handleAdd, refreshList }: FormInputProps) => {
    if (!projectData) {
        return <></>
    }

    let projects = projectData.map((project: any) => {
        return <Project key={project.id} name={project.name} description={project.description} id={project.id} order={project.order} length={projectData.length} refreshList={refreshList} />
    })

    return (
        <>
            <Grid container spacing={1} sx={{ paddingLeft: 4, paddingRight: 4 }}>
                <Grid
                    size={{ md: 4, sm: 12 }}
                    sx={{
                        border: "3px #62626221",
                        borderStyle: "solid",
                        borderRadius: "2px",
                        overflow: "auto",
                        padding: "6px"
                    }}
                >
                    {projects}
                    <Button
                        sx={{ margin: "10px" }}
                        variant="contained"
                        onClick={handleAdd}
                    >
                        Add
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}