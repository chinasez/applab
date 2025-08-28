"use client";
import { lilitaOne } from "@/app/utils/fonts";
import { Button, Input, Modal, Form, DatePicker } from "antd";
import { useState, useEffect } from "react";
import { supabase } from "@/app/utils/supabase/client";
import dayjs from 'dayjs';
import { v4 as uuidv4 } from "uuid";

interface TaskEditorProps {
  projectId: string;
}

interface Task {
  id: string | number;
  name: string;
  deadline: string; 
  status: boolean;
}

export default function TaskEditor({ projectId }: TaskEditorProps) {
  useEffect(() => {
    async function loadData() {
      const { data: collId, error } = await supabase
        .from('collections')
        .select('*')
        .eq('project_id', projectId)
        .single();
      
      if (error) console.error(error);
      if (!collId) return;
      
      setCollectionId(collId.id);
      setTitle(collId.fields.title);
      
      const { data: records, error: recordsError } = await supabase
        .from('records')
        .select('data')
        .eq('collection_id', collId.id)
        .single();
      
      if (recordsError) console.error(recordsError);
      
      if (records?.data) {
        setRecords(records.data);
      }
    }
    loadData();
  }, [projectId]);

  const [title, setTitle] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [records, setRecords] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form] = Form.useForm();

  async function changeStatus(id: string | number, NewStatus: boolean) {
    try {
      const updatedRecords = records.map(task => 
        task.id === id ? { ...task, status: NewStatus } : task
      );

      const { error } = await supabase
        .from('records')
        .update({ data: updatedRecords })
        .eq('collection_id', collectionId);

      if (error) console.error(error);
      setRecords(updatedRecords);
    } catch (error) {
      console.error(error);
    }
  }

  function EditingTask(task: Task) {
    setEditingTask(task);
    

    let deadlineDate = null;
    if (task.deadline) {
      try {

        deadlineDate = dayjs(task.deadline);

        if (!deadlineDate.isValid()) {
          deadlineDate = null;
        }
      } catch (error) {
        deadlineDate = null;
      }
    }
    
    form.setFieldsValue({
      name: task.name,
      deadline: deadlineDate,
    });
    setIsModalOpen(true);
  }

  function CloseModal() {
    setIsModalOpen(false);
    setEditingTask(null);
    form.resetFields();
  }

  async function HandleSubmit(values: { name: string; deadline: any }) {
    if (!editingTask) return;

    try {

      let formattedDeadline = '';
      if (values.deadline) {

        formattedDeadline = values.deadline.format();
      }

      const updatedRecords = records.map(task => 
        task.id === editingTask.id 
          ? {
              ...task, 
              name: values.name,
              deadline: formattedDeadline
            } 
          : task
      );

      const { error } = await supabase
        .from("records")
        .update({ data: updatedRecords })
        .eq('collection_id', collectionId);

      if (error) {
        console.error(error);
        return;
      }

      setRecords(updatedRecords);
      setIsModalOpen(false);
      setEditingTask(null);
      form.resetFields();
      
    } catch (error) {
      console.error(error);
    }
  }

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(); 
    } catch (error) {
      return dateString.substring(0, 10); 
    }
  };

  async function ChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);

    try {
    const {error} = await supabase.from('collections').update({fields: {"title": title}}).eq('project_id', projectId);
    if (error) console.error(error);
    else console.log('succesfully changed title')
    } catch (error) {
      console.error(error);
    }
  }

  async function createNewTask() {
    const newTask: Task = {
      id: uuidv4(),
      name: 'New task',
      deadline: '',
      status: false
    }

    const updatedRecords = [...records, newTask];
    setRecords(updatedRecords);

    const {error} = await supabase.from('records').update({data: updatedRecords}).eq('collection_id', collectionId);
    if (error) console.error(error);
  }

  return (
    <div className="task-editor max-w-[800px] my-0 mx-auto py-15 px-5">
      <Input
        placeholder="Task List"
        bordered={false}
        className="text-4xl text-center font-bold p-0 border-0 outline-0 "
        value={title}
        onChange={ChangeTitle}
        style={{
          fontSize: '32px',
          boxShadow: "none",
          marginBottom: '30px',
        }}
      />
      <Button
        type="primary"
        className={`w-50 ${lilitaOne.className} mb-15`}
        size="large"
        onClick={createNewTask}
      >
        Create task
      </Button>
      <ul className="space-y-5 font-sans">
        {records.map((item, index) => (
          <li key={index} className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className={`text-gray-600 text-sm ${item.status ? "line-through" : ""}`}>
                {formatDateForDisplay(item.deadline)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="small" onClick={() => EditingTask(item)}>
                Edit
              </Button>
              {item.status ? (
                <Button type="default" disabled size="small">
                  Done✔️
                </Button>
              ) : (
                <Button 
                  type="primary" 
                  onClick={() => changeStatus(item.id, true)}  
                  size="small"
                >
                  Done❌
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <Modal
        title="Edit Task"
        open={isModalOpen}
        onCancel={CloseModal}
        footer={[
          <Button key="cancel" onClick={CloseModal}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={() => form.submit()}
          >
            Save Changes
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={HandleSubmit}
        >
          <Form.Item
            label="Task Name"
            name="name"
            rules={[{ required: true, message: 'Please enter task name' }]}
          >
            <Input placeholder="Enter task name" />
          </Form.Item>
          
          <Form.Item
            label="Deadline"
            name="deadline"
          >
            <DatePicker 
              placeholder="Select deadline" 
              style={{ width: '100%' }}
              format="DD.MM.YYYY" 
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}