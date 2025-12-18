import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch Role From Backend
  const { data: role = "user", isLoading } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/users/${user.email}/role`);
      return res.data?.role || "user";
    },
  });

  return { role, isLoading };
};

export default useUserRole;
