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
      title: "Transaction",
      keys: [
        {
          key: "transaction_id",
          label: "Transaction ID",
        },
        {
          key: "loan_needs",
          label: "Needs",
          type: "textarea",
        },
        {
          key: "loanAt",
          label: "Return Date",
          type: "date",
        },
        {
          key: "returnAt",
          label: "Return Date",
          type: "date",
        },
        {
          key: "user_id",
          label: "User ID",
        },
        {
          key: "asset_id",
          label: "Asset Number",
        },
      ],
    },
    {
      type: "object",
      key: "user",
      keys: [
        {
          key: "name",
          label: "Name",
        },
      ],
    },
    {
      type: "object",
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
