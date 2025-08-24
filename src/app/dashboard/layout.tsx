"use client"
import { ReactNode } from "react";
import { Flex, Button, Drawer, Radio, Space } from "antd";
import type { DrawerProps, RadioChangeEvent } from 'antd';
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase/client";

interface Project {
  id: number,
  name: string
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);
  const [projects, setProjects] = useState<any[]>([]);
  

  useEffect(() => {
    async function loadData() {
      const {data: project, error: projectError} = await supabase.from('projects').select('*');
      setProjects(project || []);
    }
    loadData();
  }, [])
  
  function showDrawer(): void {
    setIsOpen(true);
  }
  function closeDrawer(): void {
    setIsOpen(false);
  }


  return (
    <Flex>
      <div className="grid h-screen"
      style={{
        gridTemplateColumns: isOpen ? '250px 1fr' : '0fr 1fr',
        gridTemplateRows: isHeaderVisible ? '80px 1fr' : '0fr 1fr',
      }}>
        <div className={`sider ${isOpen ? "w-[376px]" : "w-0"}`}>
          <Drawer
          title="Basic Drawer"
          placement={"left"}
          onClose={closeDrawer}
          open={isOpen}
          mask={false}
          push={true}
        >
          <div className="flex flex-col">
            {projects.map((item, index) => (
                <a key={index}>{item.name}</a>
              ))}
          </div>
        </Drawer>
        </div>
        <div className="header">
          <header style={{
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          }} className={`fixed transition-all duration-400 ease-out ${ isHeaderVisible ? "top-0" : "top-[-100px]"} ${isOpen ? "left-[376px]" : "left-0"} right-0 h-20 bg-white z-1000 flex items-center px-6 justify-between`}>
            <h2>Profile</h2>
            <p>AppLab</p>
          </header>
        </div>
        <div className={`content w-screen relative ${isOpen ? 'left-[200px]' : 'left-0'} mt-10`}>
          <button className="" onClick={() => setIsOpen(prev => !prev)}>sider</button>
          <button className="" onClick={() => setIsHeaderVisible(prev2 => !prev2)}>header</button>
          {children}
        </div>
      </div>
    </Flex>
  );
}
