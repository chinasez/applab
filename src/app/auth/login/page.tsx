"use client";
import { supabase } from "@/app/utils/supabase/client";
import { useState } from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
import { lilitaOne } from "@/app/utils/fonts";
import { useRouter } from "next/navigation";
import { NextResponse } from "next/server";

type FieldType = {
  email?: string;
  password?: string;
  remember?: boolean;
};

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function handleSubmit(): Promise<void | object> {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error)
        return NextResponse.json({ Error: error.message }, { status: 400 });

      setLoading(false);
      router.push("/dashboard");
    } catch (error) {
      alert("bruh");
      return;
    }
  }

  return (
    <div className="wrapperReg flex flex-col justify-center items-center min-h-screen">
      <div className="w-[50%] min-h-[500px] border-1 flex-col flex justify-center items-center p-15 rounded-xl space-y-8">
        <h2 className="text-4xl mb-8 text-center">Sign In</h2>
        <Form
          name="basic"
          layout="vertical"
          autoComplete="off"
          className="w-full max-w-md"
        >
          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your username!" }]}
            style={{ marginBottom: 32 }}
          >
            <Input
              size="large"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
            style={{ marginBottom: 52 }}
          >
            <Input.Password
              size="large"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item label={null}>
            <Button
              type="primary"
              htmlType="submit"
              onClick={handleSubmit}
              className={`${lilitaOne.className} w-full mb-5`}
            >
              Submit
              {loading && (
              <p
            className="text-center">
              Loading...
            </p>)}
            </Button>
            <div className="flex items-center justify-between">
              <a className={`block ${lilitaOne.className}`} href="/">Back to Home</a>
              <a className={`block text-right  ${lilitaOne.className}`} href="/auth/register">Don't have an account? Sign Up</a>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
