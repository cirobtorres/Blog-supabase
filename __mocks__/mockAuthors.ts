import { faker } from "@faker-js/faker";

export const createMockAuthor = (options?: {
  isUserNull?: string | null;
  isUpdatedAtNull?: boolean;
}) => {
  const { isUserNull = true, isUpdatedAtNull = true } = options || {};

  return {
    id: faker.string.uuid(),
    profile_id: isUserNull ? null : faker.string.uuid(),
    display_name: faker.internet.displayName(),
    updated_at: isUpdatedAtNull
      ? null
      : faker.date.soon({ refDate: "2025-01-01T00:00:00.000Z" }),
    created_at: faker.date.soon({ refDate: "2025-01-01T00:00:00.000Z" }),
  };
};
