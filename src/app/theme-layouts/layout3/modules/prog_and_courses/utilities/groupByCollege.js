function groupByCollege(data) {
  return data.reduce((result, school) => {
    const collegeCode = school.college.college_code;
    if (!result[collegeCode]) {
      result[collegeCode] = [];
    }
    result[collegeCode].push(school);
    return result;
  }, {});
}

export default groupByCollege;
