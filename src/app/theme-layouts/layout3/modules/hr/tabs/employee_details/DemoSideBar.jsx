import FuseNavigation from "@fuse/core/FuseNavigation";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const navigationData = [
  {
    id: "1",
    // title: "Actions",
    // subtitle: "Task, project & team",
    type: "group",
    children: [
      {
        id: "1.1",
        name: "deactivate",
        title: "Change Employee Status",
        type: "item",
        subtitle: "Employee Status to inactive",

        icon: "material-solid:app_registration",
        route: "photo_manager/reports",
      },
      {
        id: "1.2",
        name: "report",
        title: "Employee Report",
        subtitle: "Full Report of the employee",
        type: "item",
        icon: "material-solid:auto_graph",
        route: "photo_manager/updated_photos",
      },
      {
        id: "1.3",
        name: "edit",
        title: "Edit Employee Details",
        subtitle: "Update Employee Details",
        type: "item",
        icon: "material-solid:clear_all",
        route: "admissions",
      },
      // {
      //   id: "1.4",
      //   name: "bulk_sms",
      //   title: "Bulk SMS",
      //   type: "item",
      //   icon: "material-solid:sms",
      //   route: "registration/reports",
      // },
      // {
      //   id: "1.5",
      //   name: "configurator",
      //   title: "Configurator",
      //   // subtitle: "",
      //   type: "item",
      //   icon: "material-solid:settings",
      //   route: "registration/reports",
      // },
    ],
  },
  {
    id: "4",
    type: "divider",
  },
];

function DemoSidebar({ changeContent }) {
  const navigate = useNavigate();
  return (
    <div className="px-12 py-24">
      <div className="mx-12 text-3xl font-bold tracking-tighter">
        Quick Actions
      </div>
      <div
        style={{
          marginTop: -35,
        }}
      >
        <FuseNavigation
          navigation={navigationData}
          className="px-0"
          style={{
            backgroundColor: "red",
          }}
          // navigation={(item) => `/${item.route}`}
          onItemClick={(item) => {
            changeContent(item.name);
          }}
        />
      </div>
    </div>
  );
}

export default DemoSidebar;
