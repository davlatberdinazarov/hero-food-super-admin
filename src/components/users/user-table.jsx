import React, { useEffect, useState } from "react";
import CustomDataTable from "../../lib/CustomDataTable";
import Loader from "../../lib/Loader";
import $api from "../../utils/api";
import { useRenderStore } from "../../stores/rendersStore";
import { Button, Avatar } from "@material-tailwind/react";
import { BASE_URL } from "../../utils";
import { DeleteUser } from "./delete-user";

function UserTable() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { usersRender } = useRenderStore();

  // Fetch users data
  const fetchData = () => {
    setLoading(true);
    $api
      .get("/users/all")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        console.error("Failed to fetch users:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [usersRender]);

  // Define columns for the user table
  const columns = [
    { name: "Full Name", selector: (row) => row.fullName, sortable: true },
    { name: "Phone", selector: (row) => row.phone, sortable: true },
    {
      name: "Role",
      selector: (row) => row.role.charAt(0).toUpperCase() + row.role.slice(1),
      sortable: true,
    },
    {
      name: "Image",
      selector: (row) => (
        <Avatar
          src={row.image ? `${BASE_URL}/uploads/${row.image}` : '/image.png'} 
          alt={row.fullName}
          variant="circular"
          size="sm"
        />
      ),
      sortable: false,
    },
    {
      name: "Created At",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => (
        <div className="flex items-center gap-2">
          <DeleteUser id={row.id}/>
        </div>
      ),
      sortable: false,
      width: "130px",
    },
  ];

  if (loading) return <Loader loading={loading} />;

  return (
    <div className="overflow-x-auto">
      <div className="my-4 flex justify-between items-center">
        <h2 className="text-black font-bold text-xl">Users</h2>
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        <CustomDataTable
          columns={columns}
          data={users}
          page={page}
          perPage={perPage}
          setPage={setPage}
          setPerPage={setPerPage}
        />
      </div>
    </div>
  );
}

export default UserTable;
