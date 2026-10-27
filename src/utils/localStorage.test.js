import { getFavorites, saveFavorites } from "./localStorage";

describe("localStorage utilities", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("getFavorites returns empty array when nothing is stored", () => {
    expect(getFavorites()).toEqual([]);
  });

  test("saveFavorites persists and retrieves movie items", () => {
    const mockMovies = [{ id: 101, title: "Inception" }];
    saveFavorites(mockMovies);
    expect(getFavorites()).toEqual(mockMovies);
  });
});
