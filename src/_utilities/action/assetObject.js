export const addObject = [
  {
    name: "asset_number",
    label: "Asset Number",
    placeholder: "Input Asset Number",
  },
  {
    name: "class",
    label: "Class",
    placeholder: "Input Class Type",
  },
  {
    name: "creator",
    label: "Creator",
    placeholder: "Input Creator",
  },
  {
    name: "description",
    label: "Description",
    placeholder: "Asset Description",
  },
  {
    name: "location",
    label: "Location",
    placeholder: "Asset Location",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      {
        value: "AV",
        name: "Available",
      },
      {
        value: "REPAIR",
        name: "Under Repair/Maintance",
      },
      {
        value: "NA",
        name: "Not Available",
      },
    ],
  },
];

export const editObject = [
  {
    name: "asset_number",
    label: "Asset Number",
    placeholder: "Input Asset Number",
    disabled: true,
  },
  {
    name: "class",
    label: "Class",
    placeholder: "Input Class Type",
  },
  {
    name: "creator",
    label: "Creator",
    placeholder: "Input Creator",
  },
  {
    name: "description",
    label: "Description",
    placeholder: "Asset Description",
  },
  {
    name: "location",
    label: "Location",
    placeholder: "Asset Location",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      {
        value: "AV",
        name: "Available",
      },
      {
        value: "REPAIR",
        name: "Under Repair/Maintance",
      },
      {
        value: "NA",
        name: "Not Available",
      },
    ],
  },
];

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
