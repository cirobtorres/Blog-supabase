// import "@testing-library/jest-dom";
// import { render, screen, waitFor } from "@testing-library/react";
// import { faker } from "@faker-js/faker";
// import { createMockArticles } from "@/__mocks__/mockArticles";
// import { createBrowserAppClient } from "../supabase/client";
// import HomePage from "../app/page";

// faker.seed(1); // Snapshots consistency

// const mockArticlesUserOff = createMockArticles();
// const mockArticlesUserOn = createMockArticles({ isAuthorNull: false });

// jest.mock("next/headers", () => ({
//   cookies: jest.fn(() => ({
//     setAll: () => [],
//     getAll: () => [],
//   })),
// }));

// jest.mock("@/supabase/client", () => ({
//   createBrowserAppClient: jest.fn(),
// }));

// jest.mock("@/supabase/server", () => ({
//   createServerAppClient: jest.fn(() => ({
//     auth: {
//       getUser: jest.fn(() => ({
//         data: { user: { user_metadata: { displayName: "UserTest" } } },
//       })),
//     },
//   })),
// }));

// describe("HomePage", () => {
//   it("renders in the document (user off)", async () => {
//     // Returns a select and overrideTypes mocking.
//     const mockFrom = {
//       select: jest.fn().mockReturnValue({
//         order: jest.fn().mockReturnValue({
//           overrideTypes: jest.fn().mockReturnValue({
//             data: null,
//             error: { message: "Error" },
//           }),
//         }),
//       }),
//     };

//     (createBrowserAppClient as jest.Mock).mockReturnValue({
//       from: jest.fn().mockReturnValue(mockFrom),
//     });

//     render(await HomePage());

//     await waitFor(() => {
//       mockArticlesUserOff.forEach((articleMock) => {
//         const article = screen.getByText(articleMock.title);
//         expect(article).toBeInTheDocument();
//       });
//     });
//   });

//   it("renders in the document (user on)", async () => {
//     // Returns a select and overrideTypes mocking.
//     const mockFrom = {
//       select: jest.fn().mockReturnValue({
//         overrideTypes: jest.fn().mockReturnValue({
//           data: mockArticlesUserOn,
//           error: null,
//         }),
//       }),
//     };

//     (createBrowserAppClient as jest.Mock).mockReturnValue({
//       from: jest.fn().mockReturnValue(mockFrom),
//     });

//     render(await HomePage());

//     await waitFor(() => {
//       mockArticlesUserOn.forEach((articleMock) => {
//         const article = screen.getByText(articleMock.title);
//         expect(article).toBeInTheDocument();
//       });
//     });
//   });

//   it("renders error when there is an error to the supabase query", async () => {
//     const consoleErrorSpy = jest
//       .spyOn(console, "error")
//       .mockImplementation(() => {});

//     // Returns a select and overrideTypes mocking.
//     const mockFrom = {
//       select: jest.fn().mockReturnValue({
//         overrideTypes: jest.fn().mockReturnValue({
//           data: null,
//           error: { message: "Error" },
//         }),
//       }),
//     };

//     (createBrowserAppClient as jest.Mock).mockReturnValue({
//       from: jest.fn().mockReturnValue(mockFrom),
//     });

//     render(await HomePage());

//     expect(
//       screen.getByText("Wops, an error has occurred.")
//     ).toBeInTheDocument();

//     expect(consoleErrorSpy).toHaveBeenCalled();

//     consoleErrorSpy.mockRestore();
//   });

//   it("renders 'No article' when there is no article", async () => {
//     // Returns a select and overrideTypes mocking.
//     const mockFrom = {
//       select: jest.fn().mockReturnValue({
//         overrideTypes: jest.fn().mockReturnValue({
//           data: [],
//           error: null,
//         }),
//       }),
//     };

//     (createBrowserAppClient as jest.Mock).mockReturnValue({
//       from: jest.fn().mockReturnValue(mockFrom),
//     });

//     render(await HomePage());

//     expect(screen.getByText("No article yet =|")).toBeInTheDocument();
//   });

//   it("matches the snapshot", async () => {
//     // Returns a select and overrideTypes mocking.
//     const mockFrom = {
//       select: jest.fn().mockReturnValue({
//         overrideTypes: jest.fn().mockReturnValue({
//           data: mockArticlesUserOn,
//           error: null,
//         }),
//       }),
//     };

//     (createBrowserAppClient as jest.Mock).mockReturnValue({
//       from: jest.fn().mockReturnValue(mockFrom),
//     });

//     const { asFragment } = render(await HomePage());

//     expect(asFragment()).toMatchSnapshot();
//   });
// });
