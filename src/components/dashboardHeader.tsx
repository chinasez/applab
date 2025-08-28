interface DashboardHeaderProps {
  isOpen: boolean;
  isHeaderVisible: boolean;
}

export default function DashboardHeader({ isOpen, isHeaderVisible }: DashboardHeaderProps) {
  return (
    <header 
      style={{
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      }} 
      className={`fixed transition-all duration-400 ease-out ${isHeaderVisible ? "top-0" : "top-[-100px]"} ${isOpen ? "left-[376px]" : "left-0"} right-0 h-14 bg-white z-1000 flex items-center px-6 justify-between`}
    >
      <h2>Profile</h2>
      <p>AppLab</p>
    </header>
  );
}