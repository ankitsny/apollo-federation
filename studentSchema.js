import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Student @key(fields: "id") {
    id: Int!
    name: String!
    courses: [Course]
  }
  extend type Course @key(fields: "id") {
    id: Int! @external
  }

  extend type Query {
    student(id: Int!): Student
    students: [Student]
  }
`;

const students = {
  1: { name: "Student 1", courses: [1, 2] },
  2: { name: "Student 2", courses: [2, 1] },
  3: { name: "Student 3", courses: [1] },
  4: { name: "Student 4", courses: [2] },
  5: { name: "Student 5", courses: [1, 2, 3] },
  6: { name: "Student 6", courses: [2, 3] },
  7: { name: "Student 7", courses: [3, 2] },
  8: { name: "Student 8", courses: [1, 3] },
  9: { name: "Student 9", courses: [3] },
  10: { name: "Student 10", courses: [3, 1, 2] },
  11: { name: "Student 11", courses: [1, 3, 2] },
};

export const resolvers = {
  Student: {
    courses(student) {
      return student.courses.map((id) => ({ __typename: "Course", id }));
    },

    // _resolveReference is used when some external server wants to access student
    __resolveReference(ref) {
      // TODO: fetch from rest or any other data source, for not hardcoded
      const student = students[ref.id];
      if (!student) throw new Error(`Student #${ref.id} not found!`);
      return { ...student };
    },
  },

  Query: {
    async student(_, { id }, context) {
      const student = students[id]; // TODO: fetch from external data source
      if (!student) throw new Error(`Student #${id} not found!`);
      return { ...student };
    },

    async students(_, {}, context) {
      return Object.entries(students).map((v) => ({
        ...v[1],
        id: v[0],
      }));
    },
  },
};
