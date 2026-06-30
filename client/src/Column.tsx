import { Button, Grid } from '@mui/material';
import './App.css'
import { Project } from './Project';

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
                        onClick={() => { handleAdd(columnName) }}
                    >
                        Add
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}