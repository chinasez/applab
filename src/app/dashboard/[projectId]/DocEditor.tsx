"use client";
import { useState, useEffect, useCallback } from "react";
import { Input, Button, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useCollection } from "@/hooks/useCollection";

const { TextArea } = Input;

interface DocEditorProps {
  projectId: string;
}

export default function DocEditor({ projectId }: DocEditorProps) {
  const { collection, records, updateRecords, updateCollectionFields, loading } = useCollection(projectId);
  const [localContent, setLocalContent] = useState("");
  const [localTitle, setLocalTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);


  useEffect(() => {
    if (collection) {
      setLocalTitle(collection.fields?.name || "");
      console.log('какаше1')
    }
    if (records) {
      setLocalContent(records.data || "");
      console.log('какашка')
    }
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setLocalContent(newContent);
    setHasUnsavedChanges(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setLocalTitle(newTitle);
    setHasUnsavedChanges(true);
  };


  const saveDocument = useCallback(async () => {
    if (!hasUnsavedChanges) return;
    
    setIsSaving(true);
    try {

      if (collection) {
        await updateCollectionFields({ ...collection.fields, name: localTitle });
      }
      

      const success = await updateRecords({ data: localContent });
      
      if (success) {
        setHasUnsavedChanges(false);
        message.success("Документ сохранен");
      }
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      message.error("Ошибка сохранения документа");
    } finally {
      setIsSaving(false);
    }
  }, [hasUnsavedChanges, collection, localTitle, localContent, updateCollectionFields, updateRecords]);


  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "У вас есть несохраненные изменения. Вы уверены, что хотите уйти?";
        return "У вас есть несохраненные изменения. Вы уверены, что хотите уйти?";
      }
    };

    const handleUnload = () => {
      if (hasUnsavedChanges) {

        navigator.sendBeacon?.('/api/save-before-unload', JSON.stringify({
          content: localContent,
          title: localTitle,
          projectId
        }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
      

      if (hasUnsavedChanges) {
        saveDocument().catch(console.error);
      }
    };
  }, []);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveDocument();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [saveDocument]);

  if (loading) {
    return <div className="p-8">Загрузка документа...</div>;
  }

  if (!collection || records === null) {
    return <div className="p-8">Ошибка загрузки документа</div>;
  }

  return (
    <div className="doc-editor max-w-[800px] my-0 mx-auto py-8 px-5">
 
      <div className="flex items-center justify-between mb-6">
        <Input
          value={localTitle}
          onChange={handleTitleChange}
          placeholder="Название документа"
          bordered={false}
          style={{
            fontSize: "32px",
            fontWeight: "700",
            padding: "0",
            border: "none",
            outline: "none",
            boxShadow: "none",
            flex: 1,
            marginRight: "16px",
          }}
          className="doc-title"
        />
        
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={isSaving}
          onClick={saveDocument}
          disabled={!hasUnsavedChanges}
          className="min-w-[120px]"
        >
          Сохранить
        </Button>
      </div>

    
      {hasUnsavedChanges && (
        <div className="mb-4 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-700 text-sm">
          Есть несохраненные изменения
        </div>
      )}


      <TextArea
        className="text-[16px] leading-[1.6] border border-gray-200 rounded-lg p-4 resize-none"
        placeholder="Начните писать здесь..."
        autoSize={{ minRows: 20 }}
        value={localContent}
        onChange={handleContentChange}
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
        }}
      />


      <div className="mt-4 text-sm text-gray-500 flex justify-between">
        <span>
          {localContent.length} символов, {localContent.split(/\s+/).filter(Boolean).length} слов
        </span>
        <span>
          {hasUnsavedChanges ? "Не сохранено" : "Сохранено"}
        </span>
      </div>


      <div className="mt-2 text-xs text-gray-400">
        Ctrl+S для сохранения
      </div>
    </div>
  );
}