export const editObject = [
  {
    name: "report_id",
    label: "Report ID",
    disabled: true,
  },
  {
    name: "reporter_id",
    label: "Reporter ID",
    disabled: true,
  },
  {
    name: "asset_id",
    label: "Asset ID",
  },
  {
    name: "description",
    label: "Description",
  },
  {
    name: "remark1",
    label: "Remark 1",
  },
  {
    name: "remark2",
    label: "Remark 2",
  },
  {
    name: "follow_up",
    label: "Follow Up",
    type: "select",
    options: [
      {
        name: "Repair",
        value: "repair",
      },
      {
        name: "Calibration",
        value: "calibration",
      },
      {
        name: "Replace",
        value: "replace",
      },
    ],
  },
];

export const viewObject = {
  sections: [
    {
      type: "object",
      title: "Report",
      keys: [
        {
          key: "report_id",
          label: "Report ID",
        },
        {
          key: "reporter_id",
          label: "Reporter ID",
        },
        {
          key: "asset_id",
          label: "Asset ID",
        },
        {
          key: "description",
          label: "Description",
        },
      ],
    },
    {
      type: "object",
      title: "Reported Asset",
      key: "asset",
      keys: [
        {
          key: "class",
          label: "Class",
        },
        {
          key: "district",
          label: "District",
        },
        {
          key: "description",
          label: "Description",
        },
        {
          key: "location",
          label: "Location",
        },
        {
          key: "status",
          label: "Status",
        },
      ],
    },
    {
      type: "object",
      title: "Reporter",
      key: "reporter",
      keys: [
        {
          key: "name",
          label: "Name",
        },
      ],
    },
    {
      type: "object",
      title: "Group Leader",
      key: "groupLeader",
      keys: [
        {
          key: "name",
          label: "Name",
        },
      ],
    },
    {
      type: "object",
      title: "Planner",
      key: "planner",
      keys: [
        {
          key: "name",
          label: "Name",
        },
      ],
    },
    {
      type: "object",
      title: "Plant Engineer",
      key: "plantEngineer",
      keys: [
        {
          key: "name",
          label: "Name",
        },
      ],
    },
    {
      type: "object",
      title: "Section Head",
      key: "sectionHead",
      keys: [
        {
          key: "name",
          label: "Name",
        },
      ],
    },
    {
      type: "object",
      title: "Dept Head",
      key: "deptHead",
      keys: [
        {
          key: "name",
          label: "Name",
        },
      ],
    },
  ],
};
