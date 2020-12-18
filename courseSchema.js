import { gql } from "apollo-server-express";

export const typeDefs = gql`
  extend type Query {
    course(id: Int!): Course
    courses: [Course]
  }

  type Course @key(fields: "id") {
    id: Int!
    name: String!
    students: [Student]
  }

  extend type Student @key(fields: "id") {
    id: Int! @external
  }
`;

const courses = {
  1: { name: "Course 1", students: [1, 2, 3, 4, 5, 6] },
  2: { name: "Course 2", students: [4, 5, 6, 7, 8, 9] },
  3: { name: "Course 3", students: [1, 2, 3, 7, 8, 9] },
};

export const resolvers = {
  Course: {
    students(course) {
      return course.students.map((id) => ({ __typename: "Student", id }));
    },

    // this is used to resolve the Course data, that Student or any other server references. [WIP] it will be implemented in Student type
    __resolveReference(ref) {
      // INFO: Read data from a data source(DB, REST)
      // for now we will use hardcoded value
      const course = courses[ref.id];
      if (!course) throw new Error(`Course ${ref.id} not found`);
      return { ...course };
    },
  },

  Query: {
    async course(_, { id }, context) {
      const course = courses[id];
      if (!course) throw new Error(`Course ${id} not found`);
      return { ...course };
    },

    async courses(_, {}, context) {
      return Object.entries(courses).map((x) => {
        return { ...x[1], id: x[0] };
      });
    },
  },
};
