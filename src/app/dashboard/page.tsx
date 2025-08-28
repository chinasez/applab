'use client'
import {useState} from "react";
import { Button } from "antd";
import ActionButton from "@/components/actionButton";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabase/client";



export default function Dashboard() {
    const [hasSelectedContent, setHasSelectedContent] = useState<boolean>(false);
    const router = useRouter();

    async function onSelect(dataType: string): Promise<void> {
        
        if (dataType === 'table') {
            const {data: project, error: projectError} = await supabase.from('projects').insert({type: 'table', name: 'New project'}).select('id').single();
            if (projectError) {
                alert('Error')
                return;
            }
            const {data: collection, error: collectionError } = await supabase.from('collections').insert({project_id: project.id, name: 'table', fields:[{"title": "name","editable":true, "dataIndex": "name"}, {"title": "data", "editable":true, "dataIndex": "data"}]}).select('id').single();
            if (collectionError) { 
                alert('collection error')
                return;
            }
            const {data: records, error: recordsError } = await supabase.from('records').insert({collection_id: collection.id, data: [{"key": "0", "data": "data", "name": "name"}]})
            if (recordsError) {
                alert('records error')
                return;
            }
            const projectId = `${project.id}`;
            router.push(`/dashboard/${projectId}?type=${dataType}`);
        }
        if (dataType === 'tasks') {
            const {data: project, error: projectError} = await supabase.from('projects').insert({type: 'tasks', name: 'New project'}).select('id').single();
            if (projectError) {
                alert('Error')
                return;
            }
            const {data: collection, error: collectionError } = await supabase.from('collections').insert({project_id: project.id, name: 'tasks', fields:[{"name": "task1", "status": false}]}).select('id').single();
            if (collectionError) { 
                alert('collection error')
                return;
            }
            const {data: records, error: recordsError } = await supabase.from('records').insert({collection_id: collection.id, data: {}})
            if (recordsError) {
                alert('records error')
                return;
            }
            const projectId = `${project.id}`;
            router.push(`/dashboard/${projectId}?type=${dataType}`);
        }
        if (dataType === 'document') {
            const {data: project, error: projectError} = await supabase.from('projects').insert({type: 'document', name: 'New project'}).select('id').single();
            if (projectError) {
                alert('project error')
                return;
            }
            const {data: collection, error: collectionError } = await supabase.from('collections').insert({project_id: project.id, name: 'doc', fields: {"name": "docs"}}).select('id').single();
            if (collectionError) {
                alert('collection error')
                return;
            }
            const {data: records, error: recordsError} = await supabase.from('records').insert({data: {"data": "" }, collection_id: collection.id});
            if (recordsError) {
                alert('records error')
                return;
            }
            const projectId = `${project.id}`;
            router.push(`/dashboard/${projectId}?type=${dataType}`);
        }


        
    }

    return(
        <div className="content-area flex  justify-center">
    <div className="welcome-container">
      <div className="welcome-header mb-10">
        <h1 className="text-4xl mb-10">Welcome to YourCRM</h1>
        <p className="text-2xl">Get started by selecting one of the options below</p>
      </div>
      
      <div className="welcome-actions flex gap-10 mb-10">
        <div className="welcome-card border-1 rounded-2xl p-5 ">
          <div className="icon">📊</div>
          <h3 className="mb-2">Tables</h3>
          <p className="mb-6">Create and manage structured data</p>
          <ActionButton onSelect={onSelect} dataType={"table"}>
            <p>Create table</p>
          </ActionButton>
        </div>

        <div className="welcome-card border-1 rounded-2xl p-5">
          <div className="icon">📝</div>
          <h3 className="mb-2">Documents</h3>
          <p className="mb-6">Work with rich text documents</p>
          <ActionButton onSelect={onSelect} dataType={"document"}>
            <p>Create document</p>
          </ActionButton>
        </div>

        <div className="welcome-card border-1 rounded-2xl p-5">
          <div className="icon">🎯</div>
          <h3 className="mb-2">Tasks</h3>
          <p className="mb-6">Manage projects and tasks</p>
          <ActionButton onSelect={onSelect} dataType={"tasks"}>
            <p>Create tasks</p>
          </ActionButton>
        </div>
      </div>

      <div className="welcome-recent">
        <h4>Recent Files</h4>
        <p>Your recent work will appear here</p>
      </div>
    </div>
</div>
    )
}
