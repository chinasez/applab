import DocEditor from "./DocEditor"; 
import TaskEditor from "./TaskEditor";
import TableEditor from "./TableEditor";

interface PageProps {
  params: { projectId: string };
  searchParams: { type: string };
}

export default function ProjectPage({ params, searchParams }: PageProps) {
  const { projectId } = params;
  const { type } = searchParams;

  const renderEditor = () => {
    switch (type) {
      case 'table':
        return <TableEditor projectId={projectId} isDrawerOpen={false} />;
      case 'document':
        return <DocEditor projectId={projectId} />;
      case 'tasks':
        return <TaskEditor projectId={projectId} />;
      default:
        return <div className="p-8">Unknown project type: {type}</div>;
    }  
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderEditor()}
    </div>
  );
}