"use client"
import { ReactNode, useState } from "react";
import { Flex } from "antd";
import { useRouter } from "next/navigation";
import { useProjects } from "@/hooks/useProjects";
import { Project } from "@/app/types/project";
import ProjectDrawer from "@/components/projectDrawer";
import DashboardHeader from "@/components/dashboardHeader";
import EditProjectModal from "@/components/editProjectModal";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectName, setProjectName] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const router = useRouter();
  const { projects, updateProjectName } = useProjects();

  const handleProjectClick = (project: Project) => {
    router.push(`/dashboard/${project.id}?type=${project.type}`);
  };

  const handleProjectEdit = (project: Project) => {
    setEditingProject(project);
    setProjectName(project.name);
    setIsEditModalOpen(true);
  };

  const handleSaveProjectName = async () => {
    if (editingProject && projectName.trim() !== "") {
      await updateProjectName(editingProject.id, projectName);
      setIsEditModalOpen(false);
      setEditingProject(null);
      setProjectName("");
    }
  };

  const handleAddProject = () => {
    router.push('/dashboard');
  };

  return (
    <Flex>
      <div className="grid h-screen"
        style={{
          gridTemplateColumns: isDrawerOpen ? '250px 1fr' : '0fr 1fr',
          gridTemplateRows: isHeaderVisible ? '80px 1fr' : '0fr 1fr',
        }}>
        
        <div className={`sider ${isDrawerOpen ? "w-[376px]" : "w-0"}`}>
          <ProjectDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            projects={projects}
            onProjectClick={handleProjectClick}
            onProjectEdit={handleProjectEdit}
            onHomeClick={() => router.push('/dashboard')}
            onAddProject={handleAddProject}
          />
        </div>
        
        <div className="header z-98">
          <DashboardHeader isOpen={isDrawerOpen} isHeaderVisible={isHeaderVisible} />
        </div>
        
        <div className={`content w-screen relative ${isDrawerOpen ? 'left-[200px]' : 'left-0'} mt-10`}>
          <button 
            className={`fixed bottom-20 z-100 border-1 px-5 py-3 rounded-4xl cursor-pointer transition-all duration-300 opacity-35 hover:opacity-100 ${isDrawerOpen ? "translate-x-[-20rem]" : "left-25"}`} 
            onClick={() => setIsDrawerOpen(prev => !prev)}
          >
            /
          </button>
          
          <button onClick={() => setIsHeaderVisible(prev => !prev)}>
            header
          </button>
          
          {children}
        </div>
      </div>

      <EditProjectModal
        isOpen={isEditModalOpen}
        project={editingProject}
        projectName={projectName}
        onNameChange={setProjectName}
        onSave={handleSaveProjectName}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditingProject(null);
          setProjectName("");
        }}
      />
    </Flex>
  );
}