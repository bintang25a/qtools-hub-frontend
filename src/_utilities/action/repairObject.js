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
