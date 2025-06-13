import { useState } from "react";

const roles = [
  "Administrator",
  "Melvin's Access",
  "Accounting Admin",
  "Non Accounting Access",
  "Check Printing",
  "Budget Head",
  "Special Access",
];

const modules = [
  "2307",
  "Approval Matrix",
  "Bank",
  "Barangay",
  "Base Unit Value",
  "Beginning Balance",
  "Budget",
  "Budget Allotment",
  "Budget Report",
  "Budget Summary",
  "Budget Supplemental",
  "Budget Transfer",
  "Burial Service Invoice",
  "Business Permit",
  "Cashbook",
  "Chart of Accounts",
  "Check & Cash Disbursement",
  "Check Generator",
  "Community Tax",
  "Community Tax Corporation",
  "Comparison Position",
  "Currency",
  "Customer",
  "Department",
  "Disbursement Voucher",
  "Document Type",
  "Document Type Category",
  "Employee",
];

const defaultPermissions = {
  view: false,
  add: false,
  edit: false,
  delete: false,
  print: false,
  mayor: false,
};

export default function UserAccessPage() {
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [permissions, setPermissions] = useState(
    modules.reduce((acc, module) => {
      acc[module] = { ...defaultPermissions };
      return acc;
    }, {})
  );

  const togglePermission = (module, key) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: { ...prev[module], [key]: !prev[module][key] },
    }));
  };

  return (
    <div className="p-4 space-y-4">
  {/* Header: search + actions */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
    <input
      type="text"
      placeholder="Search role..."
      className="border px-3 py-2 rounded-md w-full sm:w-60"
    />
    <div className="flex gap-2">
      {["Save"].map((action) => (
        <button
          key={action}
          className={`px-4 py-2 rounded text-white ${
            action === "Close"
              ? "bg-red-600"
              : action === "Save"
              ? "bg-green-600"
              : "bg-blue-500"
          }`}
        >
          {action}
        </button>
      ))}
    </div>
  </div>

  {/* Main Content */}
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
    {/* Role List */}
    <div className="lg:col-span-3 bg-white border rounded shadow">
      <div className="border-b p-2 bg-blue-100 font-medium text-center">
        Roles
      </div>
      <ul>
        {roles.map((role) => (
          <li
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
              role === selectedRole ? "bg-blue-200 font-semibold" : ""
            }`}
          >
            {role}
          </li>
        ))}
      </ul>
    </div>

    {/* Module Permissions Table */}
    <div className="lg:col-span-9 bg-white border rounded shadow overflow-x-auto">
      <div className="border-b p-2 bg-blue-100 font-medium text-center">
        Permissions for: {selectedRole}
      </div>
      <table className="min-w-[700px] w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Module</th>
            <th className="px-2">View</th>
            <th className="px-2">Add</th>
            <th className="px-2">Edit</th>
            <th className="px-2">Delete</th>
            <th className="px-2">Print</th>
            <th className="px-2">Mayor</th>
          </tr>
        </thead>
        <tbody>
          {modules.map((mod) => (
            <tr key={mod} className="border-t">
              <td className="px-4 py-1">{mod}</td>
              {["view", "add", "edit", "delete", "print", "mayor"].map((perm) => (
                <td key={perm} className="text-center">
                  <input
                    type="checkbox"
                    checked={permissions[mod][perm]}
                    onChange={() => togglePermission(mod, perm)}
                    className="accent-blue-600"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

  );
}
