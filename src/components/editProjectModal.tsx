import { Modal, Input } from "antd";
import { Project } from "@/app/types/project";

interface EditProjectModalProps {
  isOpen: boolean;
  project: Project | null;
  projectName: string;
  onNameChange: (name: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function EditProjectModal({ 
  isOpen, 
  project, 
  projectName, 
  onNameChange, 
  onSave, 
  onCancel 
}: EditProjectModalProps) {
  return (
    <Modal
      title="Edit project name"
      open={isOpen}
      onOk={onSave}
      onCancel={onCancel}
    >
      <Input
        value={projectName}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Enter new project name"
        onPressEnter={onSave}
      />
    </Modal>
  );
}