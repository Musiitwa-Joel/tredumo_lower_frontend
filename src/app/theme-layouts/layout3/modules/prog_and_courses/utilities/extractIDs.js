// const extractIds = (data) => {
//     let ids = [];

//     const extract = (items) => {
//       items.forEach(item => {
//         ids.push(item.id);
//         if (item.children && item.children.length > 0) {
//           extract(item.children);
//         }
//       });
//     };

//     extract(data);

//     return ids;
//   };

// const extractIds = (data) => {
//   const ids = [];
//   const stack = [...data];

//   while (stack.length > 0) {
//     const item = stack.pop();
//     ids.push(item.id);
//     if (item.children && item.children.length > 0) {
//       stack.push(...item.children);
//     }
//   }

//   return ids;
// };

const extractIds = (data) => {
  if (!data) return [];
  const ids = [];
  const stack = [...data];

  while (stack.length > 0) {
    const item = stack.pop();
    if (
      item.children &&
      item.children.length > 0 &&
      item.__typename != "Course"
    ) {
      ids.push(item.id);
      stack.push(...item.children);
    }
  }

  return ids;
};

export default extractIds;
