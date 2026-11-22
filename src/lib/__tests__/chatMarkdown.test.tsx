import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { parseChatLink, renderChatMarkdown, type ChatLink } from "../chatMarkdown";

const link = (l: ChatLink, label: string, key: string) => (
  <a
    key={key}
    data-kind={l.kind}
    href={l.kind === "external" ? l.href : l.kind === "section" ? `#${l.id}` : `/project/${l.slug}`}
  >
    {label}
  </a>
);
const html = (md: string) => renderToStaticMarkup(<>{renderChatMarkdown(md, link)}</>);

describe("chat links", () => {
  it("reads section, project, https and mailto targets", () => {
    expect(parseChatLink("section:experience")).toEqual({ kind: "section", id: "experience" });
    expect(parseChatLink("project:card-tokenization")).toEqual({ kind: "project", slug: "card-tokenization" });
    expect(parseChatLink("https://github.com/x")).toEqual({ kind: "external", href: "https://github.com/x" });
    expect(parseChatLink("mailto:a@b.co")).toEqual({ kind: "external", href: "mailto:a@b.co" });
  });

  it("drops anything else, so a reply can't link to script or plain http", () => {
    expect(parseChatLink("javascript:alert(1)")).toBeNull();
    expect(parseChatLink("http://example.com")).toBeNull();
    expect(html("[click](javascript:alert(1))")).not.toContain("<a");
  });
});

describe("chat markdown", () => {
  it("never passes HTML through", () => {
    expect(html("<img src=x onerror=alert(1)>")).toContain("&lt;img");
  });

  it("splits a lead-in line from the list under it", () => {
    const out = html("He works with:\n- **Java**\n- [Kafka](section:work)");
    expect(out).toMatch(/^<p>He works with:<\/p><ul/);
    expect(out).toContain("<strong>Java</strong>");
    expect(out).toContain('data-kind="section"');
  });

  it("reads a link inside bold text, the way models often write a list of projects", () => {
    const out = html("- **[LLM Banking Assistant](project:llm-banking-chatbot)**: Spring AI");
    expect(out).toContain(
      '<strong><a data-kind="project" href="/project/llm-banking-chatbot">LLM Banking Assistant</a></strong>',
    );
    expect(out).not.toContain("](project:");
  });

  it("links bare https addresses", () => {
    expect(html("See https://github.com/achyuthkp27.")).toContain('href="https://github.com/achyuthkp27"');
  });
});
