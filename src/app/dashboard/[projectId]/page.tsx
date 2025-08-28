import DocEditor from "./DocEditor"; 
import TaskEditor from "./TaskEditor";
import TableEditor from "./TableEditor";

interface PageProps {
    params: {projectId: string};
    searchParams: { type: string};
}



export default async function Project({params, searchParams}: PageProps) {
    const { projectId } = params;
    const { type } = searchParams;

    async function renderEditor() {
        switch (type) {
            case 'table':
                return <TableEditor projectId={projectId}></TableEditor>;
            case 'document':
                return <DocEditor projectId={projectId}></DocEditor>;
            case 'tasks':
                return <TaskEditor></TaskEditor>;
            default:
                return <p>error</p>;
        }  
    }

    return(
        <div>
            <h1>Project: {`${projectId}`}</h1>
            {renderEditor()}
        </div>
    )
}