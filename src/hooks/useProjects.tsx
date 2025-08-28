import { useState, useEffect } from "react";
import { supabase } from "@/app/utils/supabase/client";
import { Project } from "@/app/types/project";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data: projects, error: projectError } = await supabase
        .from('projects')
        .select('*');
      
      if (projectError) throw projectError;
      
      setProjects(projects || []);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateProjectName = async (id: string, newName: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ name: newName })
        .eq('id', id);

      if (error) throw error;

      setProjects(prevProjects => 
        prevProjects.map(project => 
          project.id === id 
            ? { ...project, name: newName }
            : project
        )
      );
      
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error(err);
      return false;
    }
  };

  return {
    projects,
    loading,
    error,
    updateProjectName,
    refreshProjects: loadProjects
  };
};