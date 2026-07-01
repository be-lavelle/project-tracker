import { Button, Grid } from '@mui/material';
import './App.css'
import { Project } from './Project';
import AddIcon from '@mui/icons-material/Add';

type ColumnProps = {
    columnData: any,
    columnName: string
    handleAdd: any,
    refreshList: () => void
};

export const Column = ({ columnData, handleAdd, refreshList, columnName }: ColumnProps) => {
    console.log(columnData)

    if (!columnData) {
        return <></>
    }

    let projects = columnData.sort((a: { order: number; }, b: { order: number; }) => {
        return a.order - b.order
    }).map((project: any) => {
        return <Project key={project.id} name={project.name} description={project.description} id={project.id} order={project.order} length={columnData.length} refreshList={refreshList} />
    })

    return (
        <>
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
                {projects}
                <Button
                    sx={{ margin: "10px", padding: "6px", minWidth: "20px", backgroundColor: "#ffcbfd", color: "#644f62" }}

                    variant="contained"
                    onClick={() => { handleAdd(columnName) }}
                >
                    <AddIcon />
                </Button>
            </Grid>
        </>
    )
}