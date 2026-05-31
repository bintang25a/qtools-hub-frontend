export const addObject = {
  totalSection: 1,
  keys: [
    {
      key: "nrp",
      label: "NRP",
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "role",
      label: "Role",
    },
  ],
};

export const editObject = {
  sections: [],
};

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
