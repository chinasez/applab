import { ReactNode } from "react";
import { Layout, Flex } from "antd";
const { Header, Footer, Sider, Content } = Layout;


const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "#4096ff",
};

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  minHeight: "calc(100vh - 64px)",
  lineHeight: "normal",
  color: "#000",
  backgroundColor: "#f5f5f5",
  padding: "20px",
};

const siderStyle: React.CSSProperties = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#1677ff",
  minHeight: "100vh",
};

const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
  width: 'calc(50% - 8px)',
  maxWidth: 'calc(50% - 8px)',
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Flex>
      <Layout style={layoutStyle}>
        <Layout.Sider width="25%" style={siderStyle}>
          Sider
        </Layout.Sider>
        <Layout>
          <Layout.Header style={headerStyle}>Header</Layout.Header>
          <Layout.Content style={contentStyle}>Content</Layout.Content>
        </Layout>
      </Layout>
    </Flex>
  );
}
