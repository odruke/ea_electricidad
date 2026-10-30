# AGENTS.md — Project Instructions

## 1. Project Overview

Build and maintain a professional, multilingual website for **EA electricidad y multiservicios**, an independent electrical installation and maintenance business based in Calpe, Alicante, Spain.

The primary business objective is to generate qualified quote requests and make it easy for potential customers to contact the business.

The website must communicate professionalism, reliability, technical experience, and trust.

All project documentation, source-code comments, identifiers, and agent-facing instructions must be written in **English**. Customer-facing website content must be available in Spanish, English, and French.

## 2. Mandatory Project Memory

At the beginning of every task:

- Read `MEMORY.md` before exploring or modifying the project.
- Use it to understand the current implementation state, established decisions, known issues, and next steps.
- Check relevant specifications under `specs/` before implementing a feature.

At the end of every task:

- Update `MEMORY.md` with meaningful changes to the project state.
- Record important decisions and the reasons behind them.
- Record mistakes, technical discoveries, and issues future sessions should avoid.
- Update the next steps to reflect the actual project status.
- Keep `MEMORY.md` at approximately 50 lines or fewer. Consolidate or remove obsolete information.

Do not duplicate permanent development rules from this file into `MEMORY.md`. If a temporary decision becomes a permanent project convention, propose moving it here.

Never store secrets, credentials, API keys, access tokens, private customer information, or other sensitive data in `MEMORY.md` or project documentation.

## 3. Spec-Driven Development Workflow

Use Spec-Driven Development (SDD) for features and meaningful changes.

Specifications must live under:

`specs/NNN-feature-name/`

Each specification directory should contain:

- `spec.md` — Requirements, user stories, scope, acceptance criteria, and edge cases.
- `plan.md` — Technical approach, architecture, dependencies, and implementation decisions.
- `task.md` — Ordered, actionable implementation tasks.

Use sequential, zero-padded identifiers:

- `001-project-foundation`
- `002-homepage`
- `003-services`
- `004-quote-request`

Adapt these examples to the actual project sequence.

### Required workflow

1. Read `MEMORY.md`, existing specifications, and relevant source files.
2. Understand the request and identify ambiguities.
3. Write or update `spec.md` before implementation.
4. Ask targeted questions when business requirements, legal claims, or technical decisions are unclear.
5. Define the implementation approach in `plan.md`.
6. Break the plan into small, verifiable tasks in `task.md`.
7. Implement tasks incrementally, keeping the specification up to date.
8. Run the relevant checks and tests.
9. Review the changes against the acceptance criteria.
10. Update `MEMORY.md`.

Do not silently invent requirements. Record assumptions explicitly and mark unconfirmed decisions as `PENDING`.

Do not begin substantial implementation when the relevant specification or technical plan is incomplete.

For small maintenance changes, use proportional documentation rather than creating unnecessary specifications.

## 4. Business Requirements and Scope

### Business identity

- Business name: EA electricidad y multiservicios.
- Business type: Independent electrical installer.
- Experience: More than 20 years.
- Registered activity: Low Voltage Electrical Installation Company, Basic Category (IBTB).
- The business states that it holds the required professional authorization and civil liability insurance.

Do not invent registration numbers, insurance details, certificates, qualifications, or regulatory claims.

Any public-facing legal or technical claim must be consistent with the actual authorization and applicable regulations. If uncertain, ask for confirmation.

### Initial service categories

The MVP must contain exactly these five service categories:

1. New electrical installations and new construction.
2. Electrical inspections and certificates.
3. Electrical faults and repairs.
4. Air conditioning and plumbing.
5. Electrical installation maintenance.

Do not add additional service categories without explicit approval.

### Service area

Confirmed target locations:

- Calpe (Calp)
- Altea
- Benidorm
- Benissa
- Teulada

The potential inclusion of high-income residential developments and nearby urbanizations within approximately 30 minutes' driving distance remains subject to research and business confirmation.

Do not claim coverage of unconfirmed locations.

### Availability

- Working days: Monday to Friday.
- Working hours: 08:00–20:00.
- Telephone support: 08:00–20:00.
- Regular services are booked in advance, otherwise is considered an Urgent service.
- Urgent services are available during the stated working hours and may carry an additional urgency charge.
- This is not a 24/7 emergency service.

Never advertise 24-hour availability.

### Contact details

- Phone and WhatsApp: +34 668 56 32 87
- Email: info@ea-electricidadymultiservicios.com

Use appropriate `tel:` and WhatsApp links where relevant.

## 5. Design and Brand Guidelines

Use the existing brand palette:

- Primary blue: `#00208f`
- Secondary yellow: `#fad951`
- White: `#ffffff`

Design principles:

- Professional, clean, modern, and trustworthy.
- Strong visual hierarchy and clear calls to action.
- Mobile-first and fully responsive.
- High readability and accessible color contrast.
- Use genuine business photography wherever possible.
- Project images will not be available at the begining of the implementation, but we can set placeholders for them
- Avoid generic stock photography when authentic project images are available.
- The electrician may appear in selected photographs or galleries but should not dominate the brand identity.

The existing logo is available in JPG format. A refreshed SVG logo may be explored later, preserving the recognizable identity and colors. Do not replace the existing logo without approval.

Do not fabricate testimonials, ratings, project photographs, customer numbers, or business achievements.

## 6. Internationalization

The initial website languages are:

- Spanish (`es`)
- English (`en`)
- French (`fr`)

Spanish is the primary business language unless otherwise specified.

Implement internationalization using a maintainable i18n approach. Keep translations separate from application logic.

Requirements:

- All user-facing text must be translatable.
- Avoid hardcoding interface text inside reusable components.
- Use consistent translation keys.
- Ensure navigation, forms, validation messages, metadata, and SEO content are localized.
- Use appropriate language metadata and locale-aware URLs.
- Keep the architecture extensible for future Russian and German translations.

Do not machine-translate legal or regulatory content without review.

## 7. MVP Functional Requirements

The primary conversion goal is a quote-request form.

The form should collect only information needed to understand and respond to the request:

- Customer name.
- Phone number.
- Email address.
- Location or municipality.
- Requested service category.
- Description of the work.
- Optional photographs or other approved image attachments.
- Required privacy acknowledgement with a link to the privacy policy.

Clearly distinguish required and optional fields.

### Submission workflow

The MVP must:

1. Validate form data on both client and server.
2. Validate uploaded files on the server.
3. Send an email notification to `info@ea-electricidadymultiservicios.com`.
4. Include all submitted form fields in the notification.
5. Provide secure access to uploaded photographs through protected links rather than relying on large email attachments.
6. Send the customer a clear acknowledgement that the request was received.
7. Show localized success and error states.

Do not build an administration dashboard in the MVP.

Do not assume that email delivery alone is sufficient for reliable file handling. The implementation plan must define secure file storage, retention, and failure handling.

Database persistence of quote requests is a technical decision that must be evaluated during planning. Do not introduce a database solely for a hypothetical future dashboard.

### Upload security

- Allow only explicitly supported image formats.
- Validate file extensions, MIME types, and actual file content.
- Set documented per-file and total upload size limits.
- Use safe, generated storage names rather than trusting user-provided filenames.
- Store uploads privately.
- Do not expose permanent public file URLs.
- Protect upload and submission endpoints against abuse.
- Never execute or serve uploaded files as application code.

## 8. Privacy and Security

The website will process personal data and uploaded customer photographs. Treat privacy and security as core requirements.

- Apply data minimization.
- Do not collect information without a defined purpose.
- Never expose customer submissions or uploaded files publicly.
- Keep secrets in environment variables or an approved secrets manager.
- Never commit `.env` files or credentials.
- Validate and sanitize untrusted input on the server.
- Protect against spam and automated abuse.
- Use secure transport and appropriate security headers.
- Avoid logging personal data, message contents, or file contents unnecessarily.
- Define data retention and deletion behavior before production.
- Provide appropriate privacy information and consent mechanisms.
- Do not claim GDPR compliance without verifying the complete implementation and required legal documentation.

Security-sensitive changes require explicit verification.

## 9. Technical Architecture and Dependencies

The final technology stack has not yet been approved.

Before selecting frameworks, database services, storage providers, email services, or deployment platforms:

- Inspect the existing repository.
- Evaluate the requirements, project complexity, and maintenance cost.
- Prefer a simple, maintainable architecture.
- Favor established libraries and actively maintained tools.
- Explain significant trade-offs in the relevant `plan.md`.
- Ask for approval before introducing costly or unnecessary external services.

React and a modern TypeScript-based architecture are reasonable candidates, but do not assume a particular framework or backend until it has been decided.

Avoid unnecessary dependencies and premature abstraction.

Do not introduce an administration dashboard, authentication system, or database unless an approved specification requires it.

## 10. Code Quality

Follow the conventions of the selected language, framework, and existing repository.

General requirements:

- Prefer readable, maintainable, strongly typed code.
- Keep components focused and reusable.
- Separate presentation, business logic, and data access.
- Avoid duplicated logic.
- Use meaningful names.
- Handle loading, empty, success, and error states.
- Avoid unnecessary global state.
- Keep dependencies up to date and review their security implications.
- Do not suppress type errors or lint warnings without a documented reason.
- Do not leave debug statements, dead code, or temporary workarounds.

Do not invent build, lint, or test commands. Inspect the project scripts and documentation first.

## 11. Accessibility, SEO, and Performance

### Accessibility

- Use semantic HTML.
- Support keyboard navigation.
- Provide visible focus states.
- Associate labels with form controls.
- Use meaningful alternative text for informative images.
- Maintain adequate color contrast.
- Communicate form errors accessibly.
- Respect reduced-motion preferences.

### SEO

- Use descriptive, localized page titles and meta descriptions.
- Provide semantic headings and logical page structure.
- Use canonical URLs and appropriate language alternatives.
- Include local business information consistently.
- Use structured data only when its claims are accurate.
- Avoid fabricated ratings, reviews, addresses, or business details.
- Optimize pages for relevant local search intent without keyword stuffing.

### Performance

- Optimize and appropriately size photographs.
- Use modern image formats when supported.
- Avoid unnecessary client-side JavaScript.
- Lazy-load non-critical imagery.
- Minimize layout shifts.
- Prioritize mobile performance.

## 12. Testing and Verification

For every meaningful change:

- Run the relevant tests.
- Run type checking when applicable.
- Run linting and production build checks when available.
- Test responsive layouts.
- Test all affected languages.
- Verify form validation and error states.
- Verify keyboard accessibility for interactive elements.
- Review security implications for changes involving user input, uploads, email, or storage.

For quote-request functionality, verify:

- Valid submissions.
- Invalid and missing fields.
- Unsupported file types.
- Oversized files.
- Multiple attachments.
- Email notification failure.
- Customer acknowledgement behavior.
- Secure access to uploaded images.
- Duplicate or automated submissions.

Never claim that a check passed unless it was actually executed.

## 13. Git and Change Management

- Make focused, understandable changes.
- Make and mantain a relevant .gitignore file
- Avoid modifying unrelated files.
- Do not overwrite user work without inspecting it.
- Do not commit secrets or generated build artifacts.
- Keep documentation consistent with the implementation.
- Do not create commits unless requested.
- Report important files changed, checks performed, and known limitations at the end of a task.

## 14. Definition of Done

A task is complete when:

- Its acceptance criteria are satisfied.
- The implementation follows the approved specification and plan.
- Relevant tests and checks have been executed.
- No known critical regression remains.
- Documentation is updated where necessary.
- `MEMORY.md` reflects the new project state.
- Remaining limitations or pending decisions are clearly reported.
