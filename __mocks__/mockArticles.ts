import { faker } from "@faker-js/faker";

export const createMockArticles = (options?: {
  mockLength?: number;
  user_id?: string | null;
  private?: boolean;
}): Article[] => {
  const {
    mockLength = faker.number.int({ min: 1, max: 10 }),
    user_id,
    private: isPrivate,
  } = options || {};

  return Array.from({ length: mockLength }, () =>
    createMockArticle({ user_id, private: isPrivate })
  );
};

export const createMockArticle = (options?: {
  user_id?: string | null;
  private?: boolean;
}): Article => {
  return {
    id: faker.string.uuid(),
    user_id:
      options?.user_id !== undefined ? options.user_id : faker.string.uuid(),
    title: faker.lorem.sentence(faker.number.int({ min: 5, max: 10 })),
    body: faker.lorem.sentences(faker.number.int({ min: 3, max: 6 })),
    private: options?.private || false,
    updated_at: faker.date.soon({ refDate: "2025-01-01T00:00:00.000Z" }),
    created_at: faker.date.soon({ refDate: "2025-01-01T00:00:00.000Z" }),
  };
};
