export const addObject = [
  {
    name: "asset_id",
    label: "Asset ID",
    placeholder: "Input Asset ID",
  },
  {
    name: "repairAt",
    label: "Repair Date",
    type: "datetime-local",
  },
  {
    name: "finishAt",
    label: "Return Date",
    type: "datetime-local",
  },
  {
    name: "notes",
    label: "Repair Notes",
    placeholder: "Make a notes about the equipment (tools or assets)",
  },
];

export const editObject = [
  {
    name: "repair_id",
    label: "Repair ID",
    disabled: true,
  },
  {
    name: "asset_id",
    label: "Asset ID",
    disabled: true,
  },
  {
    name: "repairAt",
    label: "Repair Date",
    type: "datetime-local",
  },
  {
    name: "finishAt",
    label: "Return Date",
    type: "datetime-local",
  },
  {
    name: "notes",
    label: "Repair Notes",
  },
];

export const viewObject = {
  sections: [
    {
      type: "object",
      title: "Repair",
      keys: [
        {
          key: "repair_id",
          label: "Repair ID",
        },
        {
          key: "asset_id",
          label: "Asset ID",
        },
        {
          key: "repairAt",
          label: "Repair Date",
          type: "date",
        },
        {
          key: "finishAt",
          label: "Return Date",
          type: "date",
        },
      ],
    },
    {
      type: "object",
      title: "Asset",
      key: "asset",
      keys: [
        {
          key: "class",
          label: "Class",
        },
        {
          key: "creator",
          label: "Creator",
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
  ],
};
