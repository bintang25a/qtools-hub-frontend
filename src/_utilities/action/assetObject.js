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
      title: "Asset",
      keys: [
        {
          key: "asset_number",
          label: "Asset Number",
        },
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
        {
          key: "updatedAt",
          label: "Last Update",
          type: "date",
        },
      ],
    },
    {
      type: "array",
      title: "Borrow History",
      key: "transactions",
      keys: [
        {
          key: "transaction_id",
          label: "Transaction ID",
        },
        {
          key: "loanAt",
          label: "Borrow Date",
          type: "date",
        },
        {
          key: "returnAt",
          label: "Return Date",
          type: "date",
        },
      ],
    },
    {
      type: "array",
      title: "Repair History",
      key: "repairs",
      keys: [
        {
          key: "repair_id",
          label: "Repair ID",
        },
        {
          key: "repairAt",
          label: "Repair Date",
          type: "date",
        },
        {
          key: "finishAt",
          label: "Finish Date",
          type: "date",
        },
      ],
    },
    {
      type: "array",
      title: "Report History",
      key: "reports",
      keys: [
        {
          key: "report_id",
          label: "Report ID",
        },
        {
          key: "createdAt",
          label: "Reported Date",
          type: "date",
        },
      ],
    },
  ],
};
