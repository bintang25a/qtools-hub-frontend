export const editObject = [
  {
    name: "transaction_id",
    label: "Transaction ID",
    disabled: true,
  },
  {
    name: "user_id",
    label: "User ID",
  },
  {
    name: "asset_id",
    label: "Asset Number",
  },
  {
    name: "loan_needs",
    label: "Needs",
    type: "textarea",
  },
  {
    name: "loanAt",
    label: "Borrow Date",
    type: "datetime-local",
  },
  {
    name: "returnAt",
    label: "Return Date",
    type: "datetime-local",
  },
];

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
          label: "Borrow Date",
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
      title: "User",
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
      title: "Borrowed Asset",
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
  ],
};
