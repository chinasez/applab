"use client";
import { useState, useRef } from "react";
import { supabase } from "@/app/utils/supabase/client";
import { Input } from "antd";

const { TextArea } = Input;

export default function DocEditor() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  return (
    <div className="doc-editor max-w-[800px] my-0 mx-auto py-15 px-5">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
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
        onChange={(e) => setContent(e.target.value)}
      ></TextArea>
    </div>
  );
}
