// Function to map GraphQL data to Ant Design Tree format
const mapDataToTree = (schools, nationalityCategories) => {
  return schools.map((school) => ({
    key: school.id,
    title: school.label,
    level: 1,
    isLeaf: false,
    children: school.children.map((course) => ({
      key: course.id,
      title: course.label,
      level: 2,
      isLeaf: false,
      children: Array.from({ length: course.course_duration }, (_, i) => ({
        key: `${course.id}-year-${i + 1}`,
        title: `Year ${i + 1}`,
        level: 3,
        isLeaf: false,
        // Add nationality categories below each year
        children: nationalityCategories.map((category) => ({
          key: `${course.id}-year-${i + 1}-category-${category.id}`,
          title: category.category_title,
          level: 4,
          isLeaf: false,
          // Add course study times below nationality categories
          children: course.course_study_times.map((studyTime) => ({
            key: `course-${course.id}-year-${i + 1}-category-${category.id}-studyTime-${studyTime.id}`,
            title: (
              <span
                style={{
                  color: "red",
                }}
              >
                {studyTime.study_time_title}
              </span>
            ),
            isLeaf: true,
            level: 7,
          })),
        })),
      })),
    })),
  }));
};

export default mapDataToTree;
