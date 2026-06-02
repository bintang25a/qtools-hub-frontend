export const addObject = [
  {
    name: "asset_id",
    label: "Asset ID",
  },
  {
    name: "description",
    label: "Description",
  },
];

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
      title: "Reported Asset",
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
