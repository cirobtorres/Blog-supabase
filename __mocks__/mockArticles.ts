import { faker } from "@faker-js/faker";

export const createMockArticles = (options?: {
  mockLength?: number;
  private?: boolean;
  isAuthorNull?: boolean;
  isUpdatedAtNull?: boolean;
}): Article[] => {
  const {
    mockLength = faker.number.int({ min: 1, max: 10 }),
    private: isPrivate = false,
    isAuthorNull = true,
    isUpdatedAtNull = true,
  } = options || {};

  return Array.from({ length: mockLength }, () =>
    createMockArticle({ isAuthorNull, private: isPrivate, isUpdatedAtNull })
  );
};

export const createMockArticle = (options?: {
  private?: boolean;
  isAuthorNull?: boolean;
  isUpdatedAtNull?: boolean;
}): Article => {
  const {
    private: isPrivate = false,
    isAuthorNull = true,
    isUpdatedAtNull = true,
  } = options || {};

  return {
    id: faker.string.uuid(),
    author_id: isAuthorNull ? null : faker.string.uuid(),
    title: faker.lorem.sentence(faker.number.int({ min: 5, max: 10 })),
    sub_title: faker.lorem.sentence(faker.number.int({ min: 5, max: 10 })),
    body: faker.lorem.sentences(faker.number.int({ min: 3, max: 6 })),
    private: isPrivate || false,
    updated_at: isUpdatedAtNull
      ? faker.date.soon({ refDate: "2025-01-01T00:00:00.000Z" })
      : null,
    created_at: faker.date.soon({ refDate: "2025-01-01T00:00:00.000Z" }),
  };
};
