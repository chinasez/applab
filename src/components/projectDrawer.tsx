import { Drawer, Button } from "antd";
import { Project } from "@/app/types/project";
import { lilitaOne } from "@/app/utils/fonts";

interface ProjectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onProjectClick: (project: Project) => void;
  onProjectEdit: (project: Project) => void;
  onHomeClick: () => void;
  onAddProject: () => void;
}

export default function ProjectDrawer({ 
  isOpen, 
  onClose, 
  projects, 
  onProjectClick, 
  onProjectEdit,
  onHomeClick,
  onAddProject
}: ProjectDrawerProps) {
  return (
    <Drawer
      title="Your creations"
      placement="left"
      onClose={onClose}
      open={isOpen}
      mask={false}
      push={true}
      zIndex={99}
    >
      <div className="flex flex-col">
        <Button type="primary" className={`mb-5 ${lilitaOne.className}`} onClick={onHomeClick}>
          Home
        </Button>
        <Button type="primary" className={`mb-5 ${lilitaOne.className}`} onClick={onAddProject}>
          Add new project
        </Button>
        
        {projects.map((item) => (
          <Button 
            key={item.id}
            className={`mb-5 ${lilitaOne.className}`} 
            onClick={() => onProjectClick(item)}
            onContextMenu={(e) => {
              e.preventDefault();
              onProjectEdit(item);
            }}
          > 
            <div className="flex justify-between">
              <p>{item.name}</p>
              <p className="opacity-40">{item.type}</p>
            </div>
          </Button>
        ))}
      </div>
    </Drawer>
  );
}