"use client"
import { ReactNode } from "react";
import { Flex, Button, Drawer, Radio, Space } from "antd";
import type { DrawerProps, RadioChangeEvent } from 'antd';
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase/client";
import { useRouter } from "next/navigation";
import { lilitaOne } from "../utils/fonts";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);
  const [projects, setProjects] = useState<any[]>([]);
  

  useEffect(() => {
    async function loadData() {
      const {data: project, error: projectError} = await supabase.from('projects').select('*');
      setProjects(project || []);
    }
    loadData();
  }, [projects])
  
  function showDrawer(): void {
    setIsOpen(true);
  }
  function closeDrawer(): void {
    setIsOpen(false);
  }

  interface projId {
    id: string,
    type: string,
  }

  function Routing(item: projId ): void {
      const projectID = item.id;
      const dataType = item.type;
      router.push(`/dashboard/${projectID}?type=${dataType}`)
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
          title="Your creations"
          placement={"left"}
          onClose={closeDrawer}
          open={isOpen}
          mask={false}
          push={true}
          zIndex={99}
        >
          <div className="flex flex-col ">
            <Button type="primary" className={`mb-5 ${lilitaOne.className}` } onClick={() => {router.push('/dashboard')}}>Home</Button>
            {projects.map((item, index) => (
                <Button key={index} className={`mb-5 ${lilitaOne.className}` } onClick={() => Routing(item)}>
                  <div className="flex justify-between">
                    <p>{item.name}</p>
                    <p className="opacity-40">{item.type}</p>
                  </div>
                  </Button>
              ))}
          </div>
        </Drawer>
        </div>
        <div className="header z-98">
          <header style={{
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          }} className={`fixed transition-all duration-400 ease-out ${ isHeaderVisible ? "top-0" : "top-[-100px]"} ${isOpen ? "left-[376px]" : "left-0"} right-0 h-14 bg-white z-1000 flex items-center px-6 justify-between`}>
            <h2>Profile</h2>
            <p>AppLab</p>
          </header>
        </div>
        <div className={`content w-screen relative ${isOpen ? 'left-[200px]' : 'left-0'} mt-10`}>
          <button className={`fixed bottom-20  z-100 border-1 px-5 py-3 rounded-4xl cursor-pointer transition-all duration-300 opacity-35 hover:opacity-100 ${isOpen ? "translate-x-[-20rem]" : "left-25"}`} onClick={() => setIsOpen(prev => !prev)}>/</button>
          <button className="" onClick={() => setIsHeaderVisible(prev2 => !prev2)}>header</button>
          {children}
        </div>
      </div>
    </Flex>
  );
}
