import { slugify } from "@/utils/strings";
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

  const title = faker.lorem.sentence(faker.number.int({ min: 5, max: 10 }));

  return {
    id: faker.string.uuid(),
    author_id: isAuthorNull ? null : faker.string.uuid(),
    title,
    slug: slugify(title),
    sub_title: faker.lorem.sentence(faker.number.int({ min: 5, max: 10 })),
    body: faker.lorem.sentences(faker.number.int({ min: 3, max: 6 })),
    is_private: isPrivate || false,
    updated_at: isUpdatedAtNull
      ? faker.date.soon({ refDate: "2025-01-01T00:00:00.000Z" })
      : null,
    created_at: faker.date.soon({ refDate: "2025-01-01T00:00:00.000Z" }),
  };
};
