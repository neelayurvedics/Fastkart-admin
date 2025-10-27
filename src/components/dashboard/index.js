import request from "@/utils/axiosUtils";
import { NoticeRecent } from "@/utils/axiosUtils/API";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import NoticeDashBoard from "./NoticeDashBoard";
import ProductStockReportTable from "./productStockReport/ProductStockReportTable";
import RecentOrderTable from "./recentOrders/RecentOrderTable";
import RevenueAndTopVendor from "./Revenue&TopVendor";
import TopDashSection from "./TopDashSection";
import { useRouter } from "next/navigation";

const MainDashboard = () => {
  const [role, setRole] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("role");
      if (storedRole) {
        const parsedRole = JSON.parse(storedRole)?.name;
        setRole(parsedRole);
        setIsAdmin(parsedRole === "admin");
      }
    }
  }, []);
   
  const { data, refetch } = useQuery({ 
    queryKey: [NoticeRecent], 
    queryFn: () => (!isAdmin ? request({ url: NoticeRecent }, router) : Promise.resolve()), 
    refetchOnWindowFocus: false, 
    enabled: !isAdmin && role !== null, 
    select: (data) => data?.data 
  });

  if (role === null) {
    return null; // or a loading spinner
  }

  return (
    <>
      {data?.is_read === 0 && <NoticeDashBoard data={data} refetch={refetch} />}
      <TopDashSection  role={role} />
      <section>
        <RevenueAndTopVendor role={role} />
        <RecentOrderTable />
        <ProductStockReportTable role={role} />
      </section>
    </>
  );
};

export default MainDashboard;
