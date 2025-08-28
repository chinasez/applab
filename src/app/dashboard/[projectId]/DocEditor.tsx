"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/app/utils/supabase/client";
import { Input } from "antd";
import { debounce } from 'lodash';

const { TextArea } = Input;

interface DocEditorProps {
  projectId: string;
}

export default function DocEditor({projectId}: DocEditorProps) {
  const project_id = projectId;
  const [collectionId, setCollectionId] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
      const {data: collections, error: collectionsError } = await supabase.from('collections').select('*').eq('project_id', project_id).single();
      setTitle(collections.fields.name);
      setCollectionId(collections.id);

      const {data: records, error: recordsError} = await supabase.from('records').select('data').eq('collection_id', collections.id).single();
      setContent(records?.data.data);
      } catch (error) {
        console.error(error);
      }
    }
    loadData();
  },[projectId])

  const [content, setContent] = useState("");
  const [title, setTitle] = useState<string>("");

  async function changeTitle(e:React.ChangeEvent<HTMLInputElement>) {
    const newTitle = e.target.value;
    try {
      const { error } = await supabase.from('collections').update({fields : {"name": newTitle}}).eq('id', collectionId);
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    }
    setTitle(newTitle);
  }

  const saveData = useCallback(
    debounce(async (contentToSave: string) => {
      if (!collectionId) return;
      try {
        const { error } = await supabase.from('records').update({data: {"data": contentToSave}, updated_at: new Date().toISOString()}).eq('collection_id', collectionId);
        if (error) 
          console.error(error);
        else {
          console.log('Data saved Succesfully!');
        }
      } catch (error) {
        console.error(error);
      }
    }, 1000), [collectionId]
  );

  function handleContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newContet = e.target.value;
    setContent(newContet);
    saveData(newContet);
  }

  return (
    <div className="doc-editor max-w-[800px] my-0 mx-auto py-15 px-5">
      <Input
        value={title}
        onChange={changeTitle}
        placeholder="Document title"
        bordered={false}
        style={{
          fontSize: "32px",
          fontWeight: "700",
          padding: "0",
          marginBottom: "20px",
          border: "none",
          outline: "none",
          boxShadow: "none",
        }}
        className="doc-title"
      />
      <TextArea
        className="text-[18px] leading-[1.8] border-0 outline-0 resize-none p-0"
        placeholder="..."
        autoSize={{ minRows: 25 }}
        value={content}
        onChange={handleContentChange}
      ></TextArea>
    </div>
  );
}
