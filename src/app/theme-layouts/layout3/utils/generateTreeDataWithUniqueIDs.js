// const generateTreeDataWithUniqueIds = (data) => {
//   return data.colleges?.map((college) => ({
//     title: college.college_title,
//     key: `college-${college.id}`, // Use the college ID with a prefix for uniqueness
//     children: college.schools.map((school) => ({
//       title: `(${school.school_code}) ${school.school_title}`,
//       key: `school-${college.id}-${school.id}`, // Combine college and school IDs
//       children: data.levels.map((level) => ({
//         title: level.level_title,
//         key: `level-${college.id}-${school.id}-${level.id}`, // Combine college, school, and level IDs
//         children: data.study_times.map((studyTime) => ({
//           title: studyTime.study_time_title,
//           key: `studyTime-${college.id}-${school.id}-${level.id}-${studyTime.id}`, // Unique study time key
//           children: data.nationality_categories.map((nationality) => ({
//             title: nationality.category_title,
//             key: `nationality-${college.id}-${school.id}-${level.id}-${studyTime.id}-${nationality.id}`, // Unique nationality key
//             isLeaf: true,
//           })),
//         })),
//       })),
//     })),
//   }));
// };

const generateTreeDataWithUniqueIds = (data) => {
  return data.colleges.map((college) => ({
    title: college.college_title,
    key: `college-${college.id}`, // Use the college ID with a prefix for uniqueness
    children: college.schools.map((school) => ({
      title: school.school_title,
      key: `school-${college.id}-${school.id}`, // Combine college and school IDs
      children: school.levels.map((level) => ({
        title: level.level_title,
        key: `level-${college.id}-${school.id}-${level.id}`, // Combine college, school, and level IDs
        children: level.study_times.map((studyTime) => ({
          title: studyTime.study_time_title,
          key: `studyTime-${college.id}-${school.id}-${level.id}-${studyTime.id}`, // Unique study time key
          children: data.nationality_categories.map((nationality) => ({
            title: nationality.category_title,
            key: `nationality,${college.id},${school.id},${level.id},${studyTime.id},${nationality.id}`, // Unique nationality key
            isLeaf: true,
          })),
        })),
      })),
    })),
  }));
};

export default generateTreeDataWithUniqueIds;
