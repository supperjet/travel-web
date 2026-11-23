import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./Button";
import { TextField } from "./FormField";

describe("UI primitives", () => {
  it("exposes button state and design-system variants", () => {
    render(<Button variant="primary" disabled>继续</Button>);
    const button = screen.getByRole("button", { name: "继续" });
    expect(button).toBeDisabled();
    expect(button).toHaveClass("bg-primary");
  });

  it("associates field labels and validation errors", () => {
    render(<TextField label="邮箱" name="email" error="请输入有效邮箱" />);
    expect(screen.getByLabelText("邮箱")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("请输入有效邮箱");
  });
});
