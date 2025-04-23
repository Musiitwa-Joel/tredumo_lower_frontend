const groupBySchool = (departments) => {
  const schools = {};

  // Group departments by school
  departments.forEach((department) => {
    const { school } = department;
    const schoolId = department.school_id;
    if (school) {
      if (!schools[schoolId]) {
        schools[schoolId] = {
          id: schoolId,
          school_code: school.school_code,
          school_title: school.school_title,
          departments: [],
        };
      }

      schools[schoolId].departments.push({
        ...department,
      });
    }
  });

  // Convert the schools object to an array
  return Object.values(schools);
};

export default groupBySchool;
