/**
 * Sprint 5.2.2 — FormElements Component Tests
 *
 * Covers: FormInput, Button, Alert, Checkbox, FormTextarea, FormSelect
 *         with focus on accessibility attributes and rendering correctness.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import {
	FormInput,
	Button,
	Alert,
	Checkbox,
	FormTextarea,
	FormSelect,
} from "@/components/ui/FormElements";

// ── FormInput ───────────────────────────────────────────────

describe("FormInput", () => {
	it("renders label and input", () => {
		render(<FormInput label='Email' />);
		expect(screen.getByLabelText("Email")).toBeInTheDocument();
	});

	it("shows error message with role=alert", () => {
		render(<FormInput label='Email' error='Required field' />);
		const alert = screen.getByRole("alert");
		expect(alert).toHaveTextContent("Required field");
	});

	it("sets aria-invalid when error is present", () => {
		render(<FormInput label='Email' error='Bad' />);
		expect(screen.getByLabelText("Email")).toHaveAttribute(
			"aria-invalid",
			"true",
		);
	});

	it("does not set aria-invalid when no error", () => {
		render(<FormInput label='Email' />);
		expect(screen.getByLabelText("Email")).toHaveAttribute(
			"aria-invalid",
			"false",
		);
	});

	it("applies disabled state", () => {
		render(<FormInput label='Email' disabled />);
		expect(screen.getByLabelText("Email")).toBeDisabled();
	});

	it("renders icon when provided", () => {
		render(
			<FormInput label='Email' icon={<span data-testid='icon'>📧</span>} />,
		);
		expect(screen.getByTestId("icon")).toBeInTheDocument();
	});

	it("renders right element", () => {
		render(
			<FormInput
				label='Password'
				rightElement={<button data-testid='toggle'>👁</button>}
			/>,
		);
		expect(screen.getByTestId("toggle")).toBeInTheDocument();
	});
});

// ── Button ──────────────────────────────────────────────────

describe("Button", () => {
	it("renders children text", () => {
		render(<Button>Click me</Button>);
		expect(screen.getByRole("button")).toHaveTextContent("Click me");
	});

	it("is disabled when isLoading=true", () => {
		render(<Button isLoading>Loading</Button>);
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("is disabled when disabled prop is true", () => {
		render(<Button disabled>Disabled</Button>);
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("shows spinner when loading", () => {
		const { container } = render(<Button isLoading>Loading</Button>);
		const svg = container.querySelector("svg.animate-spin");
		expect(svg).toBeInTheDocument();
	});

	it("calls onClick handler", async () => {
		const user = userEvent.setup();
		const handleClick = jest.fn();
		render(<Button onClick={handleClick}>Click</Button>);
		await user.click(screen.getByRole("button"));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});
});

// ── Alert ───────────────────────────────────────────────────

describe("Alert", () => {
	it("renders children", () => {
		render(<Alert>Something went wrong</Alert>);
		expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong");
	});

	it("has role=alert", () => {
		render(<Alert variant='error'>Error!</Alert>);
		expect(screen.getByRole("alert")).toBeInTheDocument();
	});

	it("applies variant classes", () => {
		const { container } = render(<Alert variant='success'>Done!</Alert>);
		const alertEl = container.firstChild as HTMLElement;
		expect(alertEl.className).toContain("success");
	});
});

// ── Checkbox ────────────────────────────────────────────────

describe("Checkbox", () => {
	it("renders label text", () => {
		render(<Checkbox id='terms' label='Accept terms' />);
		expect(screen.getByLabelText("Accept terms")).toBeInTheDocument();
	});

	it("renders as checkbox input", () => {
		render(<Checkbox id='terms' label='Accept terms' />);
		expect(screen.getByRole("checkbox")).toBeInTheDocument();
	});

	it("shows error with role=alert", () => {
		render(<Checkbox id='terms' label='Accept' error='Required' />);
		expect(screen.getByRole("alert")).toHaveTextContent("Required");
	});

	it("can be checked", async () => {
		const user = userEvent.setup();
		render(<Checkbox id='terms' label='Accept terms' />);
		const checkbox = screen.getByRole("checkbox");
		await user.click(checkbox);
		expect(checkbox).toBeChecked();
	});
});

// ── FormTextarea ────────────────────────────────────────────

describe("FormTextarea", () => {
	it("renders label and textarea", () => {
		render(<FormTextarea label='Description' />);
		expect(screen.getByLabelText("Description")).toBeInTheDocument();
	});

	it("shows error message", () => {
		render(<FormTextarea label='Description' error='Too short' />);
		expect(screen.getByRole("alert")).toHaveTextContent("Too short");
	});

	it("shows hint when no error", () => {
		render(<FormTextarea label='Description' hint='Optional context' />);
		expect(screen.getByText("Optional context")).toBeInTheDocument();
	});

	it("hides hint when error is present", () => {
		render(
			<FormTextarea label='Description' hint='Optional' error='Required' />,
		);
		expect(screen.queryByText("Optional")).not.toBeInTheDocument();
	});
});

// ── FormSelect ──────────────────────────────────────────────

describe("FormSelect", () => {
	const options = [
		{ value: "email", label: "Email" },
		{ value: "sms", label: "SMS" },
		{ value: "internal_chat", label: "Internal Chat" },
	];

	it("renders all options", () => {
		render(<FormSelect label='Channel' options={options} />);
		expect(screen.getByLabelText("Channel")).toBeInTheDocument();
		expect(screen.getAllByRole("option")).toHaveLength(3);
	});

	it("renders placeholder option when provided", () => {
		render(
			<FormSelect label='Channel' options={options} placeholder='Select...' />,
		);
		expect(screen.getAllByRole("option")).toHaveLength(4);
	});

	it("shows error message", () => {
		render(<FormSelect label='Channel' options={options} error='Required' />);
		expect(screen.getByRole("alert")).toHaveTextContent("Required");
	});
});
