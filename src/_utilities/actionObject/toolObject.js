export const addObject = [
  {
    name: "tool_number",
    label: "Tool Number",
    placeholder: "Input Tool Number",
  },
  {
    name: "name",
    label: "Name",
    placeholder: "Input Tool Name",
  },
  {
    name: "specification",
    label: `Specification (empty = "-")`,
    placeholder: "Input Tool Specification",
  },
  {
    name: "stock_code",
    label: `Stock Code (empty = "-")`,
    placeholder: "Input Stock Code",
  },
];

export const editObject = [
  {
    name: "tool_number",
    label: "Tool Number",
    placeholder: "Input Tool Number",
    disabled: true,
  },
  {
    name: "name",
    label: "Name",
    placeholder: "Input Tool Name",
  },
  {
    name: "specification",
    label: `Specification (empty = "-")`,
    placeholder: "Input Tool Specification",
  },
  {
    name: "stock_code",
    label: `Stock Code (empty = "-")`,
    placeholder: "Input Stock Code",
  },
];

export const viewObject = {
  sections: [
    {
      type: "object",
      title: "Tool",
      keys: [
        {
          key: "tool_number",
          label: "Tool Number",
        },
        {
          key: "name",
          label: "Tool Name",
        },
        {
          key: "specification",
          label: "Tool Specification",
        },
        {
          key: "stock_code",
          label: "Stock Code",
        },
      ],
    },
  ],
};
