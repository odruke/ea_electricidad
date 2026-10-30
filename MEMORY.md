# MEMORY.md — Project Memory

Persistent project context for future OpenCode sessions. Keep this file concise (approximately 50 lines maximum). Update it after meaningful work and remove obsolete information.

## Business Context

- Business: EA electricidad y multiservicios.
- Independent electrical installer based in Calpe, Alicante, Spain.
- More than 20 years of professional experience.
- Registered as a Low Voltage Electrical Installation Company, Basic Category (IBTB).
- The business states it holds the required authorization and civil liability insurance.
- Contact: +34 668 56 32 87 | info@ea-electricidadymultiservicios.com.
- Working hours: Monday–Friday, 08:00–20:00. Urgent work is available during these hours with an urgency surcharge; no 24/7 service.

## Business Scope

- MVP service categories: new installations; electrical inspections and certificates; electrical faults and repairs; air conditioning and plumbing; electrical maintenance.
- Confirmed service locations: Calpe, Altea, Benidorm, Benissa, and Teulada.
- Research possible additional high-income residential areas within approximately 30 minutes' driving distance. Coverage requires business confirmation.
- Do not advertise unconfirmed services, locations, qualifications, or regulatory claims.

## Design and Content

- Brand colors: primary `#00208f`, secondary `#fad951`, white `#ffffff`.
- Existing logo: JPG. A refreshed SVG version may be explored later.
- Real photographs of previous work will be available in future iterations.
- The electrician may appear in selected gallery images but should not dominate the brand.
- Website languages: Spanish (primary), English, and French.
- Keep the i18n architecture extensible for future Russian and German support.

## Technical Context

- Development workflow: OpenCode + Spec-Driven Development (SDD).
- Project documentation and agent-facing content must be written in English.
- Specifications live under `specs/NNN-feature-name/`.
- Each specification contains `spec.md`, `plan.md`, and `task.md`.
- Final technology stack has not yet been approved.
- Inspect the repository before making architectural decisions.

## Decisions and Rationale

- MVP priority is generating qualified quote requests.
- No admin dashboard in the MVP: keep lead handling simple.
- Quote notifications go to the business email and include all submitted form fields.
- Uploaded photographs should use private storage and protected links, not large email attachments.
- Customer acknowledgement is sent after successful submission.
- Database persistence remains a planning decision; do not add a database without a clear need.
- Keep the initial five service categories fixed until the business approves changes.

## Learnings and Pitfalls

- Never claim 24/7 emergency availability.
- Do not invent reviews, project counts, registration numbers, insurance details, or service coverage.
- Verify legal and regulatory wording before publishing professional claims.
- Uploaded files require server-side validation, size limits, private storage, and a retention policy.
- Do not treat successful form submission as proof that notification email was delivered.

## Current State

- Business requirements and initial MVP scope have been gathered.
- Initial project instructions and memory have been defined.
- Repository structure, framework, integrations, and implementation have not yet been verified.

## Next Steps

- Inspect the repository and identify existing code, assets, and tooling.
- Agree on the technology stack and deployment approach.
- Create `specs/001-project-foundation/`.
- Define the first implementation plan and task list.
- Verify the logo and available project photographs.
- Research additional service-area locations before publishing expanded coverage.
