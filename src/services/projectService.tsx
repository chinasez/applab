import { supabase } from "@/app/utils/supabase/client";
import { ProjectType } from "@/app/types/project";

export const projectService = {
  async createTableProject() {
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({ type: 'table', name: 'New project' })
      .select('id')
      .single();

    if (projectError) throw projectError;

    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .insert({ 
        project_id: project.id, 
        name: 'table', 
        fields: [
          { "title": "name", "editable": true, "dataIndex": "name" }, 
          { "title": "data", "editable": true, "dataIndex": "data" }
        ]
      })
      .select('id')
      .single();

    if (collectionError) throw collectionError;

    const { error: recordsError } = await supabase
      .from('records')
      .insert({ collection_id: collection.id, data: [{ "key": "0", "data": "data", "name": "name" }] });

    if (recordsError) throw recordsError;

    return project.id;
  },

  async createTasksProject() {
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({ type: 'tasks', name: 'New project' })
      .select('id')
      .single();

    if (projectError) throw projectError;

    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .insert({ 
        project_id: project.id, 
        name: 'tasks', 
        fields: [{ "name": "task1", "status": false }]
      })
      .select('id')
      .single();

    if (collectionError) throw collectionError;

    const { error: recordsError } = await supabase
      .from('records')
      .insert({ collection_id: collection.id, data: {} });

    if (recordsError) throw recordsError;

    return project.id;
  },

  async createDocumentProject() {
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({ type: 'document', name: 'New project' })
      .select('id')
      .single();

    if (projectError) throw projectError;

    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .insert({ 
        project_id: project.id, 
        name: 'doc', 
        fields: { "name": "docs" }
      })
      .select('id')
      .single();

    if (collectionError) throw collectionError;

    const { error: recordsError } = await supabase
      .from('records')
      .insert({ data: { "data": "" }, collection_id: collection.id });

    if (recordsError) throw recordsError;

    return project.id;
  },

  async createProject(type: ProjectType) {
    switch (type) {
      case 'table':
        return this.createTableProject();
      case 'tasks':
        return this.createTasksProject();
      case 'document':
        return this.createDocumentProject();
      default:
        throw new Error(`Unknown project type: ${type}`);
    }
  }
};