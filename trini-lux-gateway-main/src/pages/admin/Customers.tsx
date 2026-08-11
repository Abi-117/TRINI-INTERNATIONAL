import { useEffect, useState } from "react";
import axios from "axios";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken")
      : "";

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(
        "https://trini-international.onrender.com/api/customer/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomers(res.data.customers);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div>

      <div className="mb-8 flex items-center justify-between">

        <h1 className="text-3xl font-bold">
          Customers
        </h1>

        <div className="rounded-lg bg-black px-5 py-3 text-white">
          Total Customers : {customers.length}
        </div>

      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">
                Customer
              </th>

              <th className="p-4 text-left">
                Phone
              </th>

              <th className="p-4 text-center">
                Orders
              </th>

              <th className="p-4 text-center">
                Total Spent
              </th>

              <th className="p-4 text-center">
                Joined
              </th>

            </tr>

          </thead>

          <tbody>

            {customers.map((user) => (

              <tr
                key={user._id}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-4">

                  <div className="font-semibold">
                    {user.name}
                  </div>

                  <div className="text-sm text-gray-500">
                    {user.email}
                  </div>

                </td>

                <td className="p-4">
                  {user.phone || "-"}
                </td>

                <td className="text-center">
                  {user.totalOrders}
                </td>

                <td className="text-center font-semibold text-green-600">
                  ₹{user.totalSpent}
                </td>

               <td className="text-center">
  {new Date(user.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}
</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Customers;