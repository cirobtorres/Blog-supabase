import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { createMockArticles } from "@/__mocks__/mockArticles";
import { supabase } from "../supabase/createClient";
import HomePage from "../app/page";
import { faker } from "@faker-js/faker";

faker.seed(1); // In order to maintain snapshots consistencies

const mockArticles = createMockArticles();

jest.mock("@/supabase/createClient", () => ({
  supabase: jest.fn(),
}));

describe("HomePage", () => {
  it("renders in the document", async () => {
    // Simulates supabase().from().select().overrideTypes() chaining API return.
    // In other words, it returns a select and overrideTypes mocking.
    const mockFrom = {
      select: jest.fn().mockReturnValue({
        overrideTypes: jest.fn().mockReturnValue({
          data: mockArticles,
          error: null,
        }),
      }),
    };

    (supabase as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue(mockFrom),
    });

    render(await HomePage());

    await waitFor(() => {
      mockArticles.forEach((articleMock) => {
        const article = screen.getByText(articleMock.title);
        expect(article).toBeInTheDocument();
      });
    });
  });

  it("renders error when there is an error to the supabase query", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Simulates supabase().from().select().overrideTypes() chaining API return.
    // In other words, it returns a select and overrideTypes mocking.
    const mockFrom = {
      select: jest.fn().mockReturnValue({
        overrideTypes: jest.fn().mockReturnValue({
          data: null,
          error: { message: "Error" },
        }),
      }),
    };

    (supabase as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue(mockFrom),
    });

    render(await HomePage());

    expect(
      screen.getByText("Wops, ocorreu um erro inesperado.")
    ).toBeInTheDocument();

    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it("renders 'No article' when there is no article", async () => {
    // Simulates supabase().from().select().overrideTypes() chaining API return.
    // In other words, it returns a select and overrideTypes mocking.
    const mockFrom = {
      select: jest.fn().mockReturnValue({
        overrideTypes: jest.fn().mockReturnValue({
          data: [],
          error: null,
        }),
      }),
    };

    (supabase as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue(mockFrom),
    });

    render(await HomePage());

    expect(screen.getByText("Nenhum artigo")).toBeInTheDocument();
  });

  it("matches the snapshot", async () => {
    // Simulates supabase().from().select().overrideTypes() chaining API return.
    // In other words, it returns a select and overrideTypes mocking.
    const mockFrom = {
      select: jest.fn().mockReturnValue({
        overrideTypes: jest.fn().mockReturnValue({
          data: mockArticles,
          error: null,
        }),
      }),
    };

    (supabase as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue(mockFrom),
    });

    const { asFragment } = render(await HomePage());

    expect(asFragment()).toMatchSnapshot();
  });
});
