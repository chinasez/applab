"use client";
import { useState } from "react";
import { Button, Input, Modal, Form, DatePicker } from "antd";
import { useCollection } from "@/hooks/useCollection";
import { lilitaOne } from "@/app/utils/fonts";
import dayjs from 'dayjs';
import { v4 as uuidv4 } from "uuid";

interface Task {
  id: string;
  name: string;
  deadline: string; 
  status: boolean;
}

interface TaskEditorProps {
  projectId: string;
}

export default function TaskEditor({ projectId }: TaskEditorProps) {
  const { collection, records, updateRecords, updateCollectionFields } = useCollection(projectId);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form] = Form.useForm();

  if (!collection || !records) return <div>Loading...</div>;

  const title = collection.fields?.title || "";
  const tasks: Task[] = Array.isArray(records) ? records : [];

  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    await updateCollectionFields({ ...collection.fields, title: newTitle });
  };

  const changeStatus = async (id: string, newStatus: boolean) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    );
    await updateRecords(updatedTasks);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    form.setFieldsValue({
      name: task.name,
      deadline: task.deadline ? dayjs(task.deadline) : null,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    form.resetFields();
  };

  const handleSubmit = async (values: { name: string; deadline: any }) => {
    if (!editingTask) return;

    const formattedDeadline = values.deadline ? values.deadline.format() : '';
    const updatedTasks = tasks.map(task => 
      task.id === editingTask.id 
        ? { ...task, name: values.name, deadline: formattedDeadline }
        : task
    );

    await updateRecords(updatedTasks);
    handleCloseModal();
  };

  const createNewTask = async () => {
    const newTask: Task = {
      id: uuidv4(),
      name: 'New task',
      deadline: '',
      status: false
    };

    const updatedTasks = [...tasks, newTask];
    await updateRecords(updatedTasks);
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString.substring(0, 10);
    }
  };

  return (
    <div className="task-editor max-w-[800px] my-0 mx-auto py-15 px-5">
      <Input
        placeholder="Task List"
        bordered={false}
        className="text-4xl text-center font-bold p-0 border-0 outline-0"
        value={title}
        onChange={handleTitleChange}
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
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div>
              <h3 className="font-semibold">{task.name}</h3>
              <p className={`text-gray-600 text-sm ${task.status ? "line-through" : ""}`}>
                {formatDateForDisplay(task.deadline)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="small" onClick={() => handleEditTask(task)}>
                Edit
              </Button>
              <Button 
                type={task.status ? "default" : "primary"} 
                onClick={() => changeStatus(task.id, !task.status)}
                size="small"
                disabled={task.status}
              >
                {task.status ? "Done✔️" : "Done❌"}
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <Modal
        title="Edit Task"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>Cancel</Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Save Changes
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Task Name"
            name="name"
            rules={[{ required: true, message: 'Please enter task name' }]}
          >
            <Input placeholder="Enter task name" />
          </Form.Item>
          <Form.Item label="Deadline" name="deadline">
            <DatePicker placeholder="Select deadline" style={{ width: '100%' }} format="DD.MM.YYYY" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}