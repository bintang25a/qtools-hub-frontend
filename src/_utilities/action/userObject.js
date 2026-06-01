export const addObject = [
  {
    name: "nrp",
    label: "NRP",
    placeholder: "Input NRP",
  },
  {
    name: "name",
    label: "Name",
    placeholder: "Input Full Name",
  },
  {
    name: "role",
    label: "Role",
    placeholder: "Input Role",
  },
];

export const editObject = [
  {
    name: "nrp",
    label: "NRP",
    placeholder: "Input NRP",
    disabled: true,
  },
  {
    name: "name",
    label: "Name",
    placeholder: "Input Full Name",
  },
  {
    name: "role",
    label: "Role",
    placeholder: "Input Role",
  },
];

export const viewObject = {
  sections: [
    {
      type: "object",
      title: "Profile",
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
    },
    {
      type: "array",
      title: "Assets Borrowing History",
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
      title: "Reports History",
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
