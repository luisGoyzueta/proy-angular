import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

export async function checkAccessibility(page: Page, selector?: string): Promise<void> {
  let analyzer = new AxeBuilder({ page }).withTags([
    'wcag2a',
    'wcag2aa',
    'wcag21a',
    'wcag21aa',
    'wcag22aa',
  ]);

  if (selector) {
    analyzer = analyzer.include(selector);
  }

  const results = await analyzer.analyze();

  if (results.violations.length > 0) {
    console.log(
      JSON.stringify(
        results.violations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          description: violation.description,
          nodes: violation.nodes.map((node) => ({
            target: node.target,
            failureSummary: node.failureSummary,
          })),
        })),
        null,
        2,
      ),
    );
  }

  expect(results.violations, 'Se encontraron problemas de accesibilidad').toEqual([]);
}
