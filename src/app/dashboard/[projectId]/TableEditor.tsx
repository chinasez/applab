"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import type { InputRef, TableProps } from "antd";
import { Button, Form, Input, Popconfirm, Table } from "antd";
import { supabase } from "@/app/utils/supabase/client";

type FormInstance<T> = React.ComponentRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  [key: string]: any;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: string;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingInlineEnd: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

interface DataType {
  key: React.Key;
  [key: string]: any;
}

interface TableEditorProps {
  projectId: string;
  isDrawerOpen: boolean;
}

type ColumnTypes = Exclude<TableProps<DataType>["columns"], undefined>;

export default function TableEditor({ projectId, isDrawerOpen }: TableEditorProps) {
  const project_id = projectId;
  const [fields, setFields] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [collectionId, setCollectionId] = useState<string>("");
  const [count, setCount] = useState(2);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: collection, error: collectionError } = await supabase
          .from("collections")
          .select('*')
          .eq('project_id', project_id)
          .single();
        
        if (collectionError) throw collectionError;
        
        if (collection) {
          setFields(collection.fields || []);
          setCollectionId(collection.id);

          const { data: records, error: recordsError } = await supabase
            .from('records')
            .select('data')
            .eq('collection_id', collection.id)
            .single();

          if (recordsError) throw recordsError;

          if (records?.data) {
            const dataWithKeys = records.data.map((item: any, index: number) => ({
              ...item,
              key: item.key || index.toString()
            }));
            setDataSource(dataWithKeys);
            setCount(dataWithKeys.length + 1);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }

    loadData();
  }, [project_id]);

  // Функция для генерации значений по умолчанию на основе типа поля
  const getDefaultValue = (field: any) => {
    const fieldName = field.dataIndex.toLowerCase();
    
    // Генерируем значения на основе имени поля
    if (fieldName.includes('name') || fieldName.includes('title')) {
      return `New Item ${count}`;
    }
    if (fieldName.includes('email')) {
      return `email${count}@example.com`;
    }
    if (fieldName.includes('phone')) {
      return `+1 (555) ${100 + count}-${1000 + count}`;
    }
    if (fieldName.includes('date')) {
      return new Date().toISOString().split('T')[0];
    }
    if (fieldName.includes('price') || fieldName.includes('cost')) {
      return (count * 10).toString();
    }
    if (fieldName.includes('quantity')) {
      return Math.floor(Math.random() * 100) + 1;
    }
    if (fieldName.includes('status')) {
      return 'active';
    }
    if (fieldName.includes('description')) {
      return 'Sample description text';
    }
    
    // Для остальных полей
    return `Value ${count}`;
  };

  const handleDelete = async (key: React.Key) => {
    try {
      const newData = dataSource.filter((item) => item.key !== key);
      setDataSource(newData);

      if (collectionId) {
        const { error } = await supabase
          .from('records')
          .update({ data: newData })
          .eq('collection_id', collectionId);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error deleting row:', error);
    }
  };

  const handleAdd = async () => {
    try {
      const newRow: DataType = {
        key: count.toString(),
      };

      // Заполняем все поля значениями по умолчанию
      fields.forEach((field) => {
        newRow[field.dataIndex] = getDefaultValue(field);
      });

      const newData = [...dataSource, newRow];
      setDataSource(newData);
      setCount(count + 1);

      if (collectionId) {
        const { error } = await supabase
          .from('records')
          .update({ data: newData })
          .eq('collection_id', collectionId);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error adding row:', error);
    }
  };

  const handleSave = async (row: DataType) => {
    try {
      const newData = [...dataSource];
      const index = newData.findIndex((item) => row.key === item.key);
      
      if (index > -1) {
        newData[index] = { ...newData[index], ...row };
        setDataSource(newData);

        if (collectionId) {
          const { error } = await supabase
            .from('records')
            .update({ data: newData })
            .eq('collection_id', collectionId);

          if (error) throw error;
        }
      }
    } catch (error) {
      console.error('Error saving row:', error);
    }
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = fields.map((col) => ({
    ...col,
    editable: true,
    onCell: (record: DataType) => ({
      record,
      editable: true,
      dataIndex: col.dataIndex,
      title: col.title,
      handleSave,
    }),
  }));

  const actionColumn = {
    title: 'Actions',
    dataIndex: 'actions',
    width: 100,
    render: (_: any, record: DataType) =>
      dataSource.length >= 1 ? (
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => handleDelete(record.key)}
        >
          <a style={{ color: '#ff4d4f' }}>Delete</a>
        </Popconfirm>
      ) : null,
  };

  const allColumns = [...columns, actionColumn];

  return (
    <div 
      className="table-editor"
      style={{
        marginLeft: isDrawerOpen ? '400px' : '0',
        transition: 'margin-left 0.3s ease',
        padding: '20px',
        minWidth: isDrawerOpen ? 'calc(100% - 400px)' : '100%'
      }}
    >
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add a row
      </Button>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={allColumns as ColumnTypes}
        pagination={false}
        scroll={{ x: true }}
      />
    </div>
  );
}