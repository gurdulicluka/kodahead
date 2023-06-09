describe("Contact Page", () => {
  beforeEach(() => {
    cy.visit("/contact");
  });

  it("shows error message on empty form submit", () => {
    cy.get("form").within(() => {
      cy.get('button[type="submit"]').click();
    });
    cy.get("input:invalid").should("exist");
  });

  it("allows sending a message", () => {
    const email = Cypress.env("email");
    const formAction = `https://formsubmit.co/${email}`;

    // Fill out form
    cy.get("#name").type("John Doe", { scrollBehavior: "center" });
    cy.get("#email").type("john.doe@example.com", { scrollBehavior: "center" });
    cy.get("#message").type("Hello World", { scrollBehavior: "center" });

    // Check if character counter is working
    cy.get("span[data-charCounter]").should(($span) => {
      const initialCount = 300;
      const updatedCount = initialCount - "Hello World".length;
      expect(updatedCount).to.equal(parseInt($span.text()));
    });

    // Change action attribute to local .env
    cy.get("form").invoke("attr", "action", formAction);

    // Submit form
    cy.get("form").within(() => {
      cy.get('button[type="submit"]').click();
    });

    cy.origin(
      "https://formsubmit.co",
      { args: { formAction } },
      ({ formAction }) => {
        cy.url().should("eq", formAction);
        cy.contains("Almost There").should("be.visible");
        cy.contains(
          "Please help us fight spam by clicking the box below:"
        ).should("be.visible");
      }
    );
  });
});
