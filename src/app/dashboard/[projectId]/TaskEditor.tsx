"use client";
import { lilitaOne } from "@/app/utils/fonts";
import { Button, Input } from "antd";
import { useState } from "react";

export default function TaskEditor() {
  const [title, setTitle] = useState("");
  return (
    <div className="task-editor max-w-[800px] my-0 mx-auto py-15 px-5">
      <Input
        placeholder="Task List"
        bordered={false}
        className="text-4xl text-center font-bold p-0 border-0 outline-0 "
        value={title}
        onChange={(e) => setTitle(e.target.value)}
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
      >
        Create task
      </Button>
      <ul className="space-y-5 font-sans">
        <li className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div>
            <h3 className="font-semibold">Complete project proposal</h3>
            <p className="text-gray-600 text-sm">Due: Tomorrow</p>
          </div>
          <div className="flex gap-2">
            <Button size="small">Edit</Button>
            <Button type="primary" size="small">
              Done
            </Button>
          </div>
        </li>

        <li className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div>
            <h3 className="font-semibold">Review client feedback</h3>
            <p className="text-gray-600 text-sm">Due: Friday</p>
          </div>
          <div className="flex gap-2">
            <Button size="small">Edit</Button>
            <Button type="primary" size="small">
              Done
            </Button>
          </div>
        </li>

        <li className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div>
            <h3 className="font-semibold">Prepare meeting agenda</h3>
            <p className="text-gray-600 text-sm">Due: Today</p>
          </div>
          <div className="flex gap-2">
            <Button size="small">Edit</Button>
            <Button type="primary" size="small">
              Done
            </Button>
          </div>
        </li>
      </ul>
    </div>
  );
}
